import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class LinkedIn implements ICredentialType {
  name = 'linkedInApi';
  displayName = 'LinkedIn API';
  documentationUrl = '';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Login Token',
      name: 'loginToken',
      type: 'string',
      default: '',
      required: true,
    }
  ];
}