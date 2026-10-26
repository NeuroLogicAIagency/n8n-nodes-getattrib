# n8n-nodes-getattrib

[GetAttrib](https://www.getattrib.com) shows which ad brought each lead and sale. This node sends leads and sales from any n8n workflow into GetAttrib, matched to the ad that brought the person.

## Install

In n8n: **Settings > Community nodes > Install**, then enter `n8n-nodes-getattrib`.

## Sign in

1. In GetAttrib, open **Integrations > n8n** and click **Create my sign-in app**. Copy the **Client ID** and **Client Secret** (the secret is shown once).
2. In n8n, create a **GetAttrib OAuth2 API** credential and paste them in.
3. Click **Connect my account** and approve access on the GetAttrib page.

If you host n8n yourself, paste the **OAuth Redirect URL** that n8n shows at the top of the credential into GetAttrib when you create the app. n8n Cloud users keep the default.

## What it does

| Resource | Operation | What happens |
| --- | --- | --- |
| Lead | Create | Adds a lead and matches it to the ad that brought the person. |
| Sale | Create | Adds a sale and credits the revenue to the ad that brought the customer. |

Pick your **Project** from the list. Add `Visitor ID` (the `attrib_sid` captured by the GetAttrib pixel on your form) or the UTM fields so the person is matched to their ad. If we already have a lead with the same email, we use that lead's ad.

Use **Unique ID** (leads) or **Order ID** (sales) so a re-run of the workflow does not count the same lead or sale twice.

## Example workflows

1. **Form to lead:** Typeform Trigger > GetAttrib (Lead > Create, email and name from the form, visitor ID from a hidden field).
2. **Payment to sale:** Stripe Trigger (payment succeeded) > GetAttrib (Sale > Create, amount and order ID from the payment).
3. **CRM won deal to sale:** HubSpot Trigger (deal won) > GetAttrib (Sale > Create).

## Support

https://www.getattrib.com
