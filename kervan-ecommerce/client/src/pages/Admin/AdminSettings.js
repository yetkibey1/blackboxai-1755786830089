import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminAPI, handleApiError } from '../../services/api';

const AdminSettings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('general');

  const settingsTabs = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'payment', label: 'Payment Gateways', icon: '💳' },
    { id: 'email', label: 'Email Settings', icon: '📧' },
    { id: 'shipping', label: 'Shipping & Tax', icon: '🚚' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' }
  ];

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <p>Configure your store settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'payment' && <PaymentSettings />}
          {activeTab === 'email' && <EmailSettings />}
          {activeTab === 'shipping' && <ShippingSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'integrations' && <IntegrationsSettings />}
        </div>
      </div>
    </div>
  );
};

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    contactEmail: '',
    supportEmail: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true }
    },
    defaultLanguage: 'en',
    defaultCurrency: 'GEL',
    timezone: 'Asia/Tbilisi'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      if (response.data.success) {
        setSettings(response.data.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await adminAPI.updateSettings(settings);
      if (response.data.success) {
        setMessage('Settings updated successfully!');
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      setMessage(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>General Settings</h3>
        <p>Basic information about your store</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Site Information */}
        <div className="form-group-section">
          <h4>Site Information</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="KERVAN Wholesale"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteUrl">Site URL</label>
              <input
                type="url"
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                placeholder="https://kervan.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              placeholder="Your trusted wholesale partner"
              rows="3"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-group-section">
          <h4>Contact Information</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@kervan.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="supportEmail">Support Email</label>
              <input
                type="email"
                id="supportEmail"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                placeholder="support@kervan.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+995 32 123 4567"
            />
          </div>
        </div>

        {/* Address */}
        <div className="form-group-section">
          <h4>Business Address</h4>
          
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              value={settings.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              placeholder="123 Rustaveli Avenue"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={settings.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="Tbilisi"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State/Region</label>
              <input
                type="text"
                id="state"
                value={settings.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                placeholder="Tbilisi"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                value={settings.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                placeholder="0108"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={settings.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
            >
              <option value="Georgia">Georgia</option>
              <option value="Turkey">Turkey</option>
              <option value="Armenia">Armenia</option>
              <option value="Azerbaijan">Azerbaijan</option>
            </select>
          </div>
        </div>

        {/* Localization */}
        <div className="form-group-section">
          <h4>Localization</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="defaultLanguage">Default Language</label>
              <select
                id="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
              >
                <option value="en">English</option>
                <option value="ka">Georgian</option>
                <option value="tr">Turkish</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="defaultCurrency">Default Currency</label>
              <select
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              >
                <option value="GEL">Georgian Lari (GEL)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="TRY">Turkish Lira (TRY)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
              >
                <option value="Asia/Tbilisi">Asia/Tbilisi</option>
                <option value="Europe/Istanbul">Europe/Istanbul</option>
                <option value="Asia/Yerevan">Asia/Yerevan</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="form-group-section">
          <h4>Business Hours</h4>
          
          <div className="business-hours">
            {Object.entries(settings.businessHours).map(([day, hours]) => (
              <div key={day} className="business-hour-row">
                <div className="day-name">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>
                
                <div className="hour-controls">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                    />
                    Open
                  </label>
                  
                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      />
                    </>
                  )}
                  
                  {hours.closed && (
                    <span className="closed-label">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    stripe: {
      enabled: false,
      publishableKey: '',
      secretKey: '',
      webhookSecret: ''
    },
    paypal: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      sandbox: true
    },
    bankTransfer: {
      enabled: true,
      bankName: '',
      accountNumber: '',
      accountName: '',
      swiftCode: '',
      instructions: ''
    },
    cashOnDelivery: {
      enabled: true,
      extraFee: 0,
      maxAmount: 1000
    }
  });

  const handlePaymentToggle = (provider, enabled) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        enabled
      }
    }));
  };

  const handlePaymentChange = (provider, field, value) => {
    setSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Payment Gateway Settings</h3>
        <p>Configure payment methods for your store</p>
      </div>

      <div className="payment-methods">
        {/* Stripe */}
        <div className="payment-method-card">
          <div className="payment-header">
            <div className="payment-info">
              <div className="payment-logo">💳</div>
              <div>
                <h4>Stripe</h4>
                <p>Accept credit cards and digital payments</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.stripe.enabled}
                onChange={(e) => handlePaymentToggle('stripe', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.stripe.enabled && (
            <div className="payment-config">
              <div className="form-row">
                <div className="form-group">
                  <label>Publishable Key</label>
                  <input
                    type="text"
                    value={settings.stripe.publishableKey}
                    onChange={(e) => handlePaymentChange('stripe', 'publishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div className="form-group">
                  <label>Secret Key</label>
                  <input
                    type="password"
                    value={settings.stripe.secretKey}
                    onChange={(e) => handlePaymentChange('stripe', 'secretKey', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Webhook Secret</label>
                <input
                  type="password"
                  value={settings.stripe.webhookSecret}
                  onChange={(e) => handlePaymentChange('stripe', 'webhookSecret', e.target.value)}
                  placeholder="whsec_..."
                />
              </div>
            </div>
          )}
        </div>

        {/* PayPal */}
        <div className="payment-method-card">
          <div className="payment-header">
            <div className="payment-info">
              <div className="payment-logo">🅿️</div>
              <div>
                <h4>PayPal</h4>
                <p>Accept PayPal payments</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.paypal.enabled}
                onChange={(e) => handlePaymentToggle('paypal', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.paypal.enabled && (
            <div className="payment-config">
              <div className="form-row">
                <div className="form-group">
                  <label>Client ID</label>
                  <input
                    type="text"
                    value={settings.paypal.clientId}
                    onChange={(e) => handlePaymentChange('paypal', 'clientId', e.target.value)}
                    placeholder="PayPal Client ID"
                  />
                </div>
                <div className="form-group">
                  <label>Client Secret</label>
                  <input
                    type="password"
                    value={settings.paypal.clientSecret}
                    onChange={(e) => handlePaymentChange('paypal', 'clientSecret', e.target.value)}
                    placeholder="PayPal Client Secret"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.paypal.sandbox}
                    onChange={(e) => handlePaymentChange('paypal', 'sandbox', e.target.checked)}
                  />
                  Use Sandbox Mode (for testing)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Bank Transfer */}
        <div className="payment-method-card">
          <div className="payment-header">
            <div className="payment-info">
              <div className="payment-logo">🏦</div>
              <div>
                <h4>Bank Transfer</h4>
                <p>Accept direct bank transfers</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.bankTransfer.enabled}
                onChange={(e) => handlePaymentToggle('bankTransfer', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.bankTransfer.enabled && (
            <div className="payment-config">
              <div className="form-row">
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={settings.bankTransfer.bankName}
                    onChange={(e) => handlePaymentChange('bankTransfer', 'bankName', e.target.value)}
                    placeholder="TBC Bank"
                  />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={settings.bankTransfer.accountNumber}
                    onChange={(e) => handlePaymentChange('bankTransfer', 'accountNumber', e.target.value)}
                    placeholder="GE29NB0000000101904917"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={settings.bankTransfer.accountName}
                    onChange={(e) => handlePaymentChange('bankTransfer', 'accountName', e.target.value)}
                    placeholder="KERVAN LLC"
                  />
                </div>
                <div className="form-group">
                  <label>SWIFT Code</label>
                  <input
                    type="text"
                    value={settings.bankTransfer.swiftCode}
                    onChange={(e) => handlePaymentChange('bankTransfer', 'swiftCode', e.target.value)}
                    placeholder="TBCBGE22"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Payment Instructions</label>
                <textarea
                  value={settings.bankTransfer.instructions}
                  onChange={(e) => handlePaymentChange('bankTransfer', 'instructions', e.target.value)}
                  placeholder="Please include your order number in the transfer reference..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className="payment-method-card">
          <div className="payment-header">
            <div className="payment-info">
              <div className="payment-logo">💵</div>
              <div>
                <h4>Cash on Delivery</h4>
                <p>Accept cash payments on delivery</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.cashOnDelivery.enabled}
                onChange={(e) => handlePaymentToggle('cashOnDelivery', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {settings.cashOnDelivery.enabled && (
            <div className="payment-config">
              <div className="form-row">
                <div className="form-group">
                  <label>Extra Fee (GEL)</label>
                  <input
                    type="number"
                    value={settings.cashOnDelivery.extraFee}
                    onChange={(e) => handlePaymentChange('cashOnDelivery', 'extraFee', parseFloat(e.target.value))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Amount (GEL)</label>
                  <input
                    type="number"
                    value={settings.cashOnDelivery.maxAmount}
                    onChange={(e) => handlePaymentChange('cashOnDelivery', 'maxAmount', parseFloat(e.target.value))}
                    placeholder="1000"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary">Save Payment Settings</button>
      </div>
    </div>
  );
};

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    smtp: {
      host: '',
      port: 587,
      secure: false,
      username: '',
      password: ''
    },
    fromEmail: '',
    fromName: '',
    templates: {
      orderConfirmation: {
        enabled: true,
        subject: 'Order Confirmation - #{orderNumber}',
        template: ''
      },
      orderShipped: {
        enabled: true,
        subject: 'Your order has been shipped - #{orderNumber}',
        template: ''
      },
      welcomeEmail: {
        enabled: true,
        subject: 'Welcome to KERVAN!',
        template: ''
      }
    }
  });

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Email Settings</h3>
        <p>Configure email delivery and templates</p>
      </div>

      <div className="email-settings">
        {/* SMTP Configuration */}
        <div className="settings-card">
          <h4>SMTP Configuration</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                value={settings.smtp.host}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Port</label>
              <input
                type="number"
                value={settings.smtp.port}
                placeholder="587"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={settings.smtp.username}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={settings.smtp.password}
                placeholder="App Password"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.smtp.secure}
              />
              Use SSL/TLS
            </label>
          </div>
        </div>

        {/* Email Templates */}
        <div className="settings-card">
          <h4>Email Templates</h4>
          
          {Object.entries(settings.templates).map(([key, template]) => (
            <div key={key} className="email-template">
              <div className="template-header">
                <h5>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h5>
                <label className="toggle-switch">
                  <input type="checkbox" checked={template.enabled} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              {template.enabled && (
                <div className="template-config">
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={template.subject}
                      placeholder="Email subject"
                    />
                  </div>
                  <div className="form-group">
                    <label>Template</label>
                    <textarea
                      value={template.template}
                      placeholder="Email template content..."
                      rows="4"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary">Test Email</button>
        <button className="btn btn-primary">Save Email Settings</button>
      </div>
    </div>
  );
};

const ShippingSettings = () => {
  const [settings, setSettings] = useState({
    tax: {
      enabled: true,
      rate: 18,
      inclusive: false
    },
    shipping: {
      freeShippingThreshold: 100,
      methods: [
        { name: 'Standard', cost: 5, estimatedDays: '3-5', enabled: true },
        { name: 'Express', cost: 10, estimatedDays: '1-2', enabled: true },
        { name: 'Same Day', cost: 20, estimatedDays: '1', enabled: false }
      ]
    }
  });

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Shipping & Tax Settings</h3>
        <p>Configure shipping methods and tax rates</p>
      </div>

      <div className="shipping-tax-settings">
        {/* Tax Settings */}
        <div className="settings-card">
          <h4>Tax Configuration</h4>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.tax.enabled}
              />
              Enable Tax Calculation
            </label>
          </div>

          {settings.tax.enabled && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.tax.rate}
                    placeholder="18"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.tax.inclusive}
                    />
                    Tax Inclusive Pricing
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Shipping Methods */}
        <div className="settings-card">
          <h4>Shipping Methods</h4>
          
          <div className="form-group">
            <label>Free Shipping Threshold (GEL)</label>
            <input
              type="number"
              value={settings.shipping.freeShippingThreshold}
              placeholder="100"
              min="0"
            />
          </div>

          <div className="shipping-methods">
            {settings.shipping.methods.map((method, index) => (
              <div key={index} className="shipping-method">
                <div className="method-header">
                  <h5>{method.name}</h5>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={method.enabled} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                {method.enabled && (
                  <div className="method-config">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Cost (GEL)</label>
                        <input
                          type="number"
                          value={method.cost}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="form-group">
                        <label>Estimated Delivery</label>
                        <input
                          type="text"
                          value={method.estimatedDays}
                          placeholder="3-5 days"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary">Save Shipping & Tax Settings</button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    twoFactor: {
      enabled: false,
      method: 'email'
    },
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false
    },
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 15
    },
    ipWhitelist: {
      enabled: false,
      addresses: []
    }
  });

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Security Settings</h3>
        <p>Configure security and authentication settings</p>
      </div>

      <div className="security-settings">
        {/* Two-Factor Authentication */}
        <div className="settings-card">
          <h4>Two-Factor Authentication</h4>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.twoFactor.enabled}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  twoFactor: { ...prev.twoFactor, enabled: e.target.checked }
                }))}
              />
              Enable Two-Factor Authentication
            </label>
          </div>

          {settings.twoFactor.enabled && (
            <div className="form-group">
              <label>Authentication Method</label>
              <select
                value={settings.twoFactor.method}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  twoFactor: { ...prev.twoFactor, method: e.target.value }
                }))}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="app">Authenticator App</option>
              </select>
            </div>
          )}
        </div>

        {/* Session Management */}
        <div className="settings-card">
          <h4>Session Management</h4>
          
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                sessionTimeout: parseInt(e.target.value)
              }))}
              min="5"
              max="1440"
            />
            <small>Users will be automatically logged out after this period of inactivity</small>
          </div>
        </div>

        {/* Password Policy */}
        <div className="settings-card">
          <h4>Password Policy</h4>
          
          <div className="form-group">
            <label>Minimum Password Length</label>
            <input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
              }))}
              min="6"
              max="50"
            />
          </div>

          <div className="password-requirements">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordPolicy: { ...prev.passwordPolicy, requireUppercase: e.target.checked }
                }))}
              />
              Require uppercase letters
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireLowercase}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordPolicy: { ...prev.passwordPolicy, requireLowercase: e.target.checked }
                }))}
              />
              Require lowercase letters
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordPolicy: { ...prev.passwordPolicy, requireNumbers: e.target.checked }
                }))}
              />
              Require numbers
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireSymbols}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordPolicy: { ...prev.passwordPolicy, requireSymbols: e.target.checked }
                }))}
              />
              Require special characters
            </label>
          </div>
        </div>

        {/* Login Security */}
        <div className="settings-card">
          <h4>Login Security</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Max Login Attempts</label>
              <input
                type="number"
                value={settings.loginAttempts.maxAttempts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  loginAttempts: { ...prev.loginAttempts, maxAttempts: parseInt(e.target.value) }
                }))}
                min="3"
                max="10"
              />
            </div>
            <div className="form-group">
              <label>Lockout Duration (minutes)</label>
              <input
                type="number"
                value={settings.loginAttempts.lockoutDuration}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  loginAttempts: { ...prev.loginAttempts, lockoutDuration: parseInt(e.target.value) }
                }))}
                min="5"
                max="60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary">Save Security Settings</button>
      </div>
    </div>
  );
};

const AppearanceSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    primaryColor: '#3498db',
    secondaryColor: '#2c3e50',
    logo: '',
    favicon: '',
    customCSS: ''
  });

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Appearance Settings</h3>
        <p>Customize the look and feel of your store</p>
      </div>

      <div className="appearance-settings">
        <div className="settings-card">
          <h4>Theme Settings</h4>
          
          <div className="form-group">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h4>Branding</h4>
          
          <div className="form-group">
            <label>Logo URL</label>
            <input
              type="url"
              value={settings.logo}
              onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label>Favicon URL</label>
            <input
              type="url"
              value={settings.favicon}
              onChange={(e) => setSettings(prev => ({ ...prev, favicon: e.target.value }))}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>

        <div className="settings-card">
          <h4>Custom CSS</h4>
          
          <div className="form-group">
            <label>Additional CSS</label>
            <textarea
              value={settings.customCSS}
              onChange={(e) => setSettings(prev => ({ ...prev, customCSS: e.target.value }))}
              placeholder="/* Add your custom CSS here */"
              rows="10"
              className="code-editor"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary">Preview Changes</button>
        <button className="btn btn-primary">Save Appearance Settings</button>
      </div>
    </div>
  );
};

const IntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState({
    googleAnalytics: {
      enabled: false,
      trackingId: ''
    },
    facebookPixel: {
      enabled: false,
      pixelId: ''
    },
    mailchimp: {
      enabled: false,
      apiKey: '',
      listId: ''
    },
    slack: {
      enabled: false,
      webhookUrl: ''
    }
  });

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Integrations</h3>
        <p>Connect with third-party services</p>
      </div>

      <div className="integrations-grid">
        {/* Google Analytics */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-logo">📊</div>
              <div>
                <h4>Google Analytics</h4>
                <p>Track website traffic and user behavior</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={integrations.googleAnalytics.enabled}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  googleAnalytics: { ...prev.googleAnalytics, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {integrations.googleAnalytics.enabled && (
            <div className="integration-config">
              <div className="form-group">
                <label>Tracking ID</label>
                <input
                  type="text"
                  value={integrations.googleAnalytics.trackingId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    googleAnalytics: { ...prev.googleAnalytics, trackingId: e.target.value }
                  }))}
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
            </div>
          )}
        </div>

        {/* Facebook Pixel */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-logo">📘</div>
              <div>
                <h4>Facebook Pixel</h4>
                <p>Track conversions and optimize ads</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={integrations.facebookPixel.enabled}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  facebookPixel: { ...prev.facebookPixel, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {integrations.facebookPixel.enabled && (
            <div className="integration-config">
              <div className="form-group">
                <label>Pixel ID</label>
                <input
                  type="text"
                  value={integrations.facebookPixel.pixelId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    facebookPixel: { ...prev.facebookPixel, pixelId: e.target.value }
                  }))}
                  placeholder="123456789012345"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mailchimp */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-logo">📧</div>
              <div>
                <h4>Mailchimp</h4>
                <p>Email marketing and newsletters</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={integrations.mailchimp.enabled}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  mailchimp: { ...prev.mailchimp, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {integrations.mailchimp.enabled && (
            <div className="integration-config">
              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  value={integrations.mailchimp.apiKey}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    mailchimp: { ...prev.mailchimp, apiKey: e.target.value }
                  }))}
                  placeholder="your-api-key"
                />
              </div>
              <div className="form-group">
                <label>List ID</label>
                <input
                  type="text"
                  value={integrations.mailchimp.listId}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    mailchimp: { ...prev.mailchimp, listId: e.target.value }
                  }))}
                  placeholder="list-id"
                />
              </div>
            </div>
          )}
        </div>

        {/* Slack */}
        <div className="integration-card">
          <div className="integration-header">
            <div className="integration-info">
              <div className="integration-logo">💬</div>
              <div>
                <h4>Slack</h4>
                <p>Get notifications in Slack</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={integrations.slack.enabled}
                onChange={(e) => setIntegrations(prev => ({
                  ...prev,
                  slack: { ...prev.slack, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {integrations.slack.enabled && (
            <div className="integration-config">
              <div className="form-group">
                <label>Webhook URL</label>
                <input
                  type="url"
                  value={integrations.slack.webhookUrl}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    slack: { ...prev.slack, webhookUrl: e.target.value }
                  }))}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary">Save Integration Settings</button>
      </div>
    </div>
  );
};

export default AdminSettings;
