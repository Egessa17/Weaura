import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, ChevronDown, ChevronUp, User, Phone, Mail, MapPin } from 'lucide-react';

const STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Delivered',
  'Cancelled',
];

const OrderCard = ({ order, onStatusChange, onVerifyPayment, isAdmin = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Unknown date';
    return date.toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':     return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Confirmed':   return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'Processing':  return <RefreshCw className="w-5 h-5 text-orange-500" />;
      case 'Dispatched':  return <Truck className="w-5 h-5 text-purple-500" />;
      case 'Delivered':   return <Package className="w-5 h-5 text-green-500" />;
      case 'Cancelled':   return <XCircle className="w-5 h-5 text-red-500" />;
      default:            return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':     return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':   return 'bg-blue-100 text-blue-800';
      case 'Processing':  return 'bg-orange-100 text-orange-800';
      case 'Dispatched':  return 'bg-purple-100 text-purple-800';
      case 'Delivered':   return 'bg-green-100 text-green-800';
      case 'Cancelled':   return 'bg-red-100 text-red-800';
      default:            return 'bg-muted text-muted-foreground';
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPayment = async () => {
    const normalized = verificationId.replace(/\s+/g, '');
    const requiredLength = order.payment_method === 'MTN MoMo' ? 11 : 12;
    if (!new RegExp(`^\\d{${requiredLength}}$`).test(normalized)) return;
    setUpdating(true);
    try {
      await onVerifyPayment(order.id, order.payment_method, normalized);
      setVerificationId('');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(order.order_status)}
              <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.created_at)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
            {order.order_status}
          </span>
        </div>

        {/* Customer summary */}
        <div className="flex items-center gap-2 mb-3 p-3 bg-muted/50 rounded-lg">
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{order.customer_name}</p>
            <p className="text-xs text-muted-foreground truncate">{order.customer_phone}</p>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment:</span>
            <span className="font-medium">{order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment status:</span>
            <span className="font-medium">{order.payment_status || 'Awaiting verification'}</span>
          </div>
          {order.status_updated_at && (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Last status change:</span>
              <span className="text-right font-medium">
                {order.status_admin?.name || 'Administrator'} · {formatDate(order.status_updated_at)}
              </span>
            </div>
          )}
          {order.transaction_id && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-xs font-medium">{order.transaction_id}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items:</span>
            <span className="font-medium">{order.items?.length || 0} item(s)</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">
            UGX {Number(order.total_amount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 flex items-center justify-between text-sm text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border"
      >
        <span>{expanded ? 'Hide details' : 'View full details'}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border bg-muted/20">

          {/* Full customer details */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">
              Customer details
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">
                    {order.customer_email}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>{order.customer_address}</span>
              </div>
              {order.delivery_zone && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground ml-6">Zone:</span>
                  <span>{order.delivery_zone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Items ordered
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-sm bg-card rounded-lg p-3 border border-border">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity}
                        {item.size && ` · Size: ${item.size}`}
                        {item.color && ` · ${item.color}`}
                      </p>
                    </div>
                    <span className="font-medium text-primary">
                      UGX {(Number(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin notes */}
          {order.admin_notes && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Admin notes
              </p>
              <p className="text-sm bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                {order.admin_notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Admin status update */}
      {isAdmin && onStatusChange && (
        <div className="px-5 py-4 border-t border-border bg-muted/10">
          {order.payment_status !== 'Verified' && order.order_status !== 'Cancelled' && onVerifyPayment && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Enter the transaction ID from the payment SMS
              </label>
              <div className="flex gap-2">
                <input
                  value={verificationId}
                  onChange={(event) => setVerificationId(event.target.value.replace(/\s+/g, ''))}
                  inputMode="numeric"
                  maxLength={order.payment_method === 'MTN MoMo' ? 11 : 12}
                  placeholder={order.payment_method === 'MTN MoMo' ? '11 digits' : '12 digits'}
                  className="flex-1 min-w-0 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={handleVerifyPayment}
                  disabled={updating || verificationId.length !== (order.payment_method === 'MTN MoMo' ? 11 : 12)}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This must exactly match the ID received in the business payment SMS.
              </p>
            </div>
          )}
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Update status
          </label>
          <select
            value={order.order_status}
            onChange={handleStatusChange}
            disabled={updating}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            {STATUS_OPTIONS.filter((status) =>
              order.payment_status === 'Verified' || status === 'Pending' || status === 'Cancelled'
            ).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {updating && (
            <p className="text-xs text-muted-foreground mt-1">Updating...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
