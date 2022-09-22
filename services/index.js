import Shopify from '@shopify/shopify-api';

const client = new Shopify.Clients.Rest('your-development-store.myshopify.com', accessToken);

export const abandonedCart = () =>{
    const data = await client.get({
        path: 'checkouts',
    });
    return data;      
}

