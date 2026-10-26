import type { ICredentialType, INodeProperties } from 'n8n-workflow';

const SUPABASE = 'https://hqnhdbmgsaxnukfshksx.supabase.co';

// "Sign in with GetAttrib": OAuth 2.1 with PKCE, served by GetAttrib's own sign-in.
export class GetAttribOAuth2Api implements ICredentialType {
	name = 'getAttribOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'GetAttrib OAuth2 API';

	documentationUrl = 'https://www.getattrib.com/integrations/overview';

	properties: INodeProperties[] = [
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden', default: 'pkce' },
		{ displayName: 'Authorization URL', name: 'authUrl', type: 'hidden', default: `${SUPABASE}/auth/v1/oauth/authorize` },
		{ displayName: 'Access Token URL', name: 'accessTokenUrl', type: 'hidden', default: `${SUPABASE}/auth/v1/oauth/token` },
		{ displayName: 'Scope', name: 'scope', type: 'hidden', default: '' },
		{ displayName: 'Auth URI Query Parameters', name: 'authQueryParameters', type: 'hidden', default: '' },
		{ displayName: 'Authentication', name: 'authentication', type: 'hidden', default: 'body' },
	];
}
