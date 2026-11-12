import { supabase } from './supabaseClient.js';
import { getCurrentUser } from './auth.js';

export async function createOrder(orderPayload, items) {
  const user = await getCurrentUser();
  const orderNumber = 'KOL-' + Math.floor(100000 + Math.random() * 900000);

  const orderData = {
    order_number: orderNumber,
    user_id: user ? user.id : null,
    customer_name: orderPayload.customer_name,
    customer_phone: orderPayload.customer_phone,
    customer_email: orderPayload.customer_email || (user ? user.email : ''),
    order_type: orderPayload.order_type || 'dine_in',
    delivery_address: orderPayload.delivery_address || null,
    table_number: orderPayload.table_number || null,
    special_instructions: orderPayload.special_instructions || '',
    total_amount: orderPayload.total_amount,
    status: 'pending',
    payment_method: orderPayload.payment_method || 'cash',
    payment_status: 'unpaid'
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItemsData = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.id.startsWith('f') ? null : item.id,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) console.warn('Could not insert items list', itemsError);

  return order;
}

export async function getUserOrders(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin orders:', error);
    return [];
  }
  return data;
}

export async function updateOrderStatus(orderId, newStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
