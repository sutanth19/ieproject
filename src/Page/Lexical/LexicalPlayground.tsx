import React, { useState } from 'react';
import { LexicalEditor } from './LexicalEditor';
import { LexicalOutputDisplay } from './LexicalOutputDisplay';
import { LexicalOutputData } from '../../types/lexical';

const LexicalPlayground: React.FC = () => {
  const [outputData, setOutputData] = useState<LexicalOutputData>({
    json: '',
    html: '',
    plainText: ''
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
        Text Editer
      </h1>
      
      <div style={{ marginBottom: '24px' }}>
        <LexicalEditor
          config={{
            namespace: 'Playground',
          }}
          placeholder="Start typing to see outputs..."
          onChange={setOutputData}
          style={{ marginBottom: '24px' }}
        />
      </div>

      <LexicalOutputDisplay data={outputData} />
    </div>
  );
};

export default LexicalPlayground;