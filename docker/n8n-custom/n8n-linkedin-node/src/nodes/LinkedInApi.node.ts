import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import axios from 'axios';

export class LinkedInApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LinkedIn API',
    name: 'linkedInApi',
    icon: 'file:linkedin.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with LinkedIn API',
    defaults: {
      name: 'LinkedIn API',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'linkedInApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Auth',
            value: 'auth',
          },
          {
            name: 'Profile',
            value: 'profile',
          },
          {
            name: 'Posts',
            value: 'posts',
          },
          {
            name: 'Network',
            value: 'network',
          },
          {
            name: 'Companies',
            value: 'companies',
          },
          {
            name: 'Messages',
            value: 'messages',
          },
        ],
        default: 'profile',
      },
      
      // Auth Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['auth'],
          },
        },
        options: [
          {
            name: 'Login',
            value: 'login',
            description: 'Login to LinkedIn',
          },
          {
            name: 'Verify Code',
            value: 'verifyCode',
            description: 'Verify authentication code',
          },
        ],
        default: 'login',
      },
      
      // Profile Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['profile'],
          },
        },
        options: [
          {
            name: 'Get My Profile',
            value: 'getMyProfile',
            description: 'Get current user profile',
          },
          {
            name: 'Extract Profile',
            value: 'extractProfile',
            description: 'Extract profile information',
          },
          {
            name: 'Extract Contact',
            value: 'extractContact',
            description: 'Extract contact information',
          },
          {
            name: 'Search People',
            value: 'searchPeople',
            description: 'Search for people',
          },
        ],
        default: 'getMyProfile',
      },
      
      // Posts Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['posts'],
          },
        },
        options: [
          {
            name: 'Create Post',
            value: 'createPost',
            description: 'Create a new post',
          },
          {
            name: 'Search Posts',
            value: 'searchPosts',
            description: 'Search for posts',
          },
          {
            name: 'Like Post',
            value: 'likePost',
            description: 'Like a post',
          },
          {
            name: 'Comment Post',
            value: 'commentPost',
            description: 'Comment on a post',
          },
          {
            name: 'Repost',
            value: 'repost',
            description: 'Repost content',
          },
          {
            name: 'Get Post Reactions',
            value: 'getReactions',
            description: 'Get reactions on a post',
          },
          {
            name: 'Get Post Comments',
            value: 'getComments',
            description: 'Get comments on a post',
          },
        ],
        default: 'searchPosts',
      },
      
      // Network Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['network'],
          },
        },
        options: [
          {
            name: 'Get Connections',
            value: 'getConnections',
            description: 'Get user connections',
          },
          {
            name: 'Connect To Profile',
            value: 'connectToProfile',
            description: 'Connect to a profile',
          },
          {
            name: 'Accept Invitation',
            value: 'acceptInvitation',
            description: 'Accept an invitation',
          },
          {
            name: 'Get Invitations',
            value: 'getInvitations',
            description: 'Get pending invitations',
          },
          {
            name: 'Get Recommendations',
            value: 'getRecommendations',
            description: 'Get network recommendations',
          },
        ],
        default: 'getConnections',
      },
      
      // Companies Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['companies'],
          },
        },
        options: [
          {
            name: 'Get Company Info',
            value: 'getCompanyInfo',
            description: 'Get company information',
          },
          {
            name: 'Search Companies',
            value: 'searchCompanies',
            description: 'Search for companies',
          },
        ],
        default: 'getCompanyInfo',
      },
      
      // Messages Operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['messages'],
          },
        },
        options: [
          {
            name: 'Send Message',
            value: 'sendMessage',
            description: 'Send a message',
          },
          {
            name: 'Get Inbox',
            value: 'getInbox',
            description: 'Get inbox messages',
          },
          {
            name: 'Get Conversation',
            value: 'getConversation',
            description: 'Get conversation details',
          },
        ],
        default: 'sendMessage',
      },
      
      // Common parameters for all operations
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
          {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            description: 'Profile or company URL',
          },
          {
            displayName: 'Keywords',
            name: 'keywords',
            type: 'string',
            default: '',
            description: 'Keywords for search',
          },
          {
            displayName: 'Message',
            name: 'message',
            type: 'string',
            default: '',
            description: 'Message content',
          },
          {
            displayName: 'Post ID',
            name: 'postId',
            type: 'string',
            default: '',
            description: 'ID of the post',
          },
          {
            displayName: 'Company URL',
            name: 'companyUrl',
            type: 'string',
            default: '',
            description: 'LinkedIn company URL',
          },
          {
            displayName: 'Profile URL',
            name: 'profileUrl',
            type: 'string',
            default: '',
            description: 'LinkedIn profile URL',
          },
          {
            displayName: 'Login Token',
            name: 'loginToken',
            type: 'string',
            default: '',
            description: 'LinkedIn login token',
          },
          {
            displayName: 'Code',
            name: 'code',
            type: 'string',
            default: '',
            description: 'Verification code',
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            description: 'Email address',
          },
          {
            displayName: 'Total Results',
            name: 'totalResults',
            type: 'number',
            default: 10,
            description: 'Maximum number of results to return',
          },
          {
            displayName: 'Country',
            name: 'country',
            type: 'string',
            default: '',
            description: 'Country code for proxy selection',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const credentials = await this.getCredentials('linkedInApi');
    const apiKey = credentials.apiKey as string;
    const loginToken = credentials.loginToken as string;
    const baseUrl = 'https://api.linkupapi.com'; // Base URL of your LinkedIn API
    
    let endpoint = '';
    let body: IDataObject = {};

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;
      const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
      
      // Add the login token to all requests
      body = {
        login_token: loginToken,
        ...additionalFields,
      };
      
      // Determine the endpoint based on resource and operation
      if (resource === 'auth') {
        if (operation === 'login') {
          endpoint = '/v1/auth/login';
        } else if (operation === 'verifyCode') {
          endpoint = '/v1/auth/verify';
        }
      } else if (resource === 'profile') {
        if (operation === 'getMyProfile') {
          endpoint = '/v1/profile/me';
        } else if (operation === 'extractProfile') {
          endpoint = '/v1/profile/info';
        } else if (operation === 'extractContact') {
          endpoint = '/v1/profile/contact';
        } else if (operation === 'searchPeople') {
          endpoint = '/v1/profile/search';
        }
      } else if (resource === 'posts') {
        if (operation === 'createPost') {
          endpoint = '/v1/posts/create';
        } else if (operation === 'searchPosts') {
          endpoint = '/v1/posts/search';
        } else if (operation === 'likePost') {
          endpoint = '/v1/posts/like';
        } else if (operation === 'commentPost') {
          endpoint = '/v1/posts/comment';
        } else if (operation === 'repost') {
          endpoint = '/v1/posts/repost';
        } else if (operation === 'getReactions') {
          endpoint = '/v1/posts/reactions';
        } else if (operation === 'getComments') {
          endpoint = '/v1/posts/extract-comments';
        }
      } else if (resource === 'network') {
        if (operation === 'getConnections') {
          endpoint = '/v1/network/connections';
        } else if (operation === 'connectToProfile') {
          endpoint = '/v1/network/connect';
        } else if (operation === 'acceptInvitation') {
          endpoint = '/v1/network/accept-invitation';
        } else if (operation === 'getInvitations') {
          endpoint = '/v1/network/invitations';
        } else if (operation === 'getRecommendations') {
          endpoint = '/v1/network/recommendations';
        }
      } else if (resource === 'companies') {
        if (operation === 'getCompanyInfo') {
          endpoint = '/v1/companies/info';
        } else if (operation === 'searchCompanies') {
          endpoint = '/v1/companies/search';
        }
      } else if (resource === 'messages') {
        if (operation === 'sendMessage') {
          endpoint = '/v1/messages/send-message';
        } else if (operation === 'getInbox') {
          endpoint = '/v1/messages/inbox';
        } else if (operation === 'getConversation') {
          endpoint = '/v1/messages/conversation';
        }
      }
      
      // Make the API request
      try {
        const response = await axios.post(
          `${baseUrl}${endpoint}`,
          body,
          {
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
          }
        );
        
        returnData.push(response.data);
      } catch (error: any) {
        if (error.response) {
          throw new Error(`LinkedIn API error: ${error.message}`);
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}