// SimpleDataProvider.js
// Export as a separate file to handle data operations for Gantt chart

class SimpleDataProvider {
    constructor(url) {
      this.url = url;
      console.log("SimpleDataProvider initialized with URL:", url);
    }
    
    // Method to get data from the server
    getData() {
      console.log("Fetching data from:", this.url);
      return fetch(this.url)
        .then(response => {
          // Check if the response is OK
          if (!response.ok) {
            console.error(`Server error: ${response.status} ${response.statusText}`);
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          // Check content type
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error(`Expected JSON but got ${contentType || 'unknown content type'}`);
            throw new Error(`Expected JSON but got ${contentType || 'unknown content type'}`);
          }
          
          return response.json();
        })
        .then(data => {
          console.log("Raw data from server:", data);
          
          // Ensure data has the right structure
          if (!data.tasks) {
            console.warn("No tasks found in server response");
            data.tasks = [];
          }
          
          if (!data.links) {
            console.warn("No links found in server response");
            data.links = [];
          }
          
          // Parse dates for tasks
          data.tasks = data.tasks.map(task => {
            if (task.start && typeof task.start === 'string') {
              task.start = new Date(task.start);
            }
            return task;
          });
          
          return data;
        });
    }
    
    // This method handles CRUD operations
    send(action, params) {
      console.log("Action requested:", action);
      console.log("Params:", JSON.stringify(params, (key, value) => {
        // Custom JSON stringify to handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }, 2));
      
      // Map Gantt action to HTTP method and endpoint
      let method = 'GET';
      let endpoint = '';
      let body = null;
      
      switch (action) {
        case 'add-task':
          method = 'POST';
          endpoint = '/task';
          body = this._prepareTaskData(params);
          break;
          
        case 'update-task':
          method = 'PUT';
          endpoint = `/task/${params.id}`;
          body = this._prepareTaskData(params);
          break;
          
        case 'delete-task':
          method = 'DELETE';
          endpoint = `/task/${params.id}`;
          break;
          
        case 'add-link':
          method = 'POST';
          endpoint = '/link';
          body = params;
          break;
          
        case 'update-link':
          method = 'PUT';
          endpoint = `/link/${params.id}`;
          body = params;
          break;
          
        case 'delete-link':
          method = 'DELETE';
          endpoint = `/link/${params.id}`;
          break;
          
        default:
          console.log(`Unknown action: ${action}`);
          return Promise.resolve({ action: action, tid: params.id });
      }
      
      // Prepare the request options
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Add credentials to allow cookies to be sent cross-domain if needed
        credentials: 'include'
      };
      
      // Add body for POST and PUT requests
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const fullUrl = `${this.url}${endpoint}`;
      console.log(`Sending ${method} request to ${fullUrl}`);
      console.log("Request options:", options);
      if (body) {
        console.log("Request body:", JSON.stringify(body, null, 2));
      }
      
      // Make the request
      return fetch(fullUrl, options)
        .then(response => {
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
            console.error(`Server error: ${response.status} ${response.statusText}`);
            return response.text().then(text => {
              try {
                // Try to parse as JSON
                const errorJson = JSON.parse(text);
                console.error("Error response:", errorJson);
                throw new Error(errorJson.error || `Server responded with status: ${response.status}`);
              } catch (e) {
                // If not JSON, use text
                console.error("Error response text:", text);
                throw new Error(`Server responded with status: ${response.status}: ${text}`);
              }
            });
          }
          return response.json();
        })
        .then(result => {
          console.log(`${action} operation successful:`, result);
          return { action, tid: result.tid || params.id, ...result };
        })
        .catch(err => {
          console.error(`Error during ${action} operation:`, err);
          // Rethrow to let the UI handle it
          throw err;
        });
    }
    
    // Helper method to prepare task data for sending to server
    _prepareTaskData(task) {
      // Create a copy of the task to avoid modifying the original
      const preparedTask = { ...task };
      
      // Ensure date is properly formatted
      if (preparedTask.start) {
        if (preparedTask.start instanceof Date) {
          // Format as ISO string for API
          preparedTask.start = preparedTask.start.toISOString();
        } else if (typeof preparedTask.start === 'string') {
          // Make sure it's a valid date string
          try {
            const date = new Date(preparedTask.start);
            if (!isNaN(date.getTime())) {
              preparedTask.start = date.toISOString();
            }
          } catch (e) {
            console.warn("Invalid date format:", preparedTask.start);
          }
        }
      }
      
      // Ensure numeric fields are properly typed
      if (preparedTask.duration !== undefined) {
        preparedTask.duration = Number(preparedTask.duration);
      }
      
      if (preparedTask.progress !== undefined) {
        preparedTask.progress = Number(preparedTask.progress);
      }
      
      return preparedTask;
    }
  }
  
  export default SimpleDataProvider;