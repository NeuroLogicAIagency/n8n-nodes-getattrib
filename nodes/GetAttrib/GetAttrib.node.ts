import type { ILoadOptionsFunctions, INodeType, INodeTypeDescription, INodeProperties } from 'n8n-workflow';

const API_URL = 'https://hqnhdbmgsaxnukfshksx.supabase.co/functions/v1/zapier-api';

const projectField: INodeProperties = {
	displayName: 'Project',
	name: 'projectId',
	type: 'options',
	required: true,
	default: '',
	description: 'The GetAttrib project this belongs to',
	typeOptions: { loadOptionsMethod: 'getProjects' },
	routing: { send: { type: 'body', property: 'projectId' } },
};

const body = (property: string) => ({ send: { type: 'body' as const, property } });

const textField = (name: string, displayName: string, description?: string): INodePropertiesLike => ({
	displayName,
	name,
	type: 'string',
	default: '',
	...(description ? { description } : {}),
	routing: body(name),
});

type INodePropertiesLike = NonNullable<INodeProperties['options']>[number] & Record<string, unknown>;

const commonFields = [
	textField('utm_ad', 'UTM Ad'),
	textField('utm_adset', 'UTM Ad Set'),
	textField('utm_campaign', 'UTM Campaign'),
	textField('utm_medium', 'UTM Medium'),
	textField('utm_source', 'UTM Source'),
	textField('visitor_id', 'Visitor ID', 'The GetAttrib visitor ID (attrib_sid) captured on your form. It lets us match the person to the exact ad.'),
];

export class GetAttrib implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GetAttrib',
		name: 'getAttrib',
		icon: 'file:getattrib.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Send leads and sales into GetAttrib, matched to the ad that brought the person',
		defaults: { name: 'GetAttrib' },
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [{ name: 'getAttribOAuth2Api', required: true }],
		requestDefaults: {
			baseURL: API_URL,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Lead', value: 'lead' },
					{ name: 'Sale', value: 'sale' },
				],
				default: 'lead',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a lead or sale',
						description: 'Add it to GetAttrib and match it to the ad that brought the person',
						routing: { request: { body: { action: '={{ $parameter["resource"] }}' } } },
					},
				],
				default: 'create',
			},
			projectField,
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['lead', 'sale'] } },
				routing: { send: { type: 'body', property: 'email' } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				description: 'The sale value, for example 497',
				displayOptions: { show: { resource: ['sale'] } },
				routing: { send: { type: 'body', property: 'amount' } },
			},
			{
				displayName: 'Additional Fields',
				name: 'leadFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['lead'] } },
				options: [
					textField('name', 'Name'),
					textField('phone', 'Phone'),
					textField('event_id', 'Unique ID', 'Stops the same lead being counted twice if the workflow runs again'),
					...commonFields,
				] as INodeProperties['options'],
			},
			{
				displayName: 'Additional Fields',
				name: 'saleFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['sale'] } },
				options: [
					textField('currency', 'Currency', 'Three letters, for example usd or gbp. Defaults to usd.'),
					textField('product', 'Product Name'),
					textField('order_id', 'Order ID', 'Stops the same sale being counted twice if the workflow runs again'),
					...commonFields,
				] as INodeProperties['options'],
			},
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions) {
				const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'getAttribOAuth2Api', {
					method: 'POST',
					url: API_URL,
					body: { action: 'projects' },
					json: true,
				})) as Array<{ id: string; name: string }>;
				return response.map((p) => ({ name: p.name, value: p.id }));
			},
		},
	};
}
