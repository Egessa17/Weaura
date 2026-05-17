
import React from 'react';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const OrderCard = ({ order, onStatusChange, isAdmin = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'Delivered':
        return <Package className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon(order.order_status)}
            <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.created)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
          {order.order_status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Method:</span>
          <span className="font-medium">{order.payment_method}</span>
        </div>
        {order.transaction_id && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-medium font-mono text-xs">{order.transaction_id}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items:</span>
          <span className="font-medium">{order.items?.length || 0} item(s)</span>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total Amount:</span>
        <span className="text-2xl font-bold text-primary">
          ${order.total_amount.toFixed(2)}
        </span>
      </div>

      {isAdmin && onStatusChange && (
        <div className="mt-4 pt-4 border-t border-border">
          <label className="text-sm font-medium mb-2 block">Update Status:</label>
          <select
            value={order.order_status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
