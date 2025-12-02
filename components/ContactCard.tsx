import React, { useState } from 'react';
import { Contact, ContactType } from '../types';
import { Phone, Mail, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (contact.type) {
      case ContactType.WHATSAPP: return <MessageCircle className="w-5 h-5 text-green-600" />;
      case ContactType.EMAIL: return <Mail className="w-5 h-5 text-slate-600" />;
      default: return <Phone className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (contact.type) {
      case ContactType.SAC: return 'SAC / Atendimento';
      case ContactType.OUVIDORIA: return 'Ouvidoria';
      case ContactType.SUPORTE_TECNICO: return 'Suporte Técnico';
      case ContactType.VENDAS: return 'Vendas / Comercial';
      default: return contact.type;
    }
  };

  return (
    <div className="flex items-start p-4 bg-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow group">
      <div className="p-2 bg-slate-50 rounded-full mr-4 group-hover:bg-blue-50 transition-colors">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          {getTypeLabel()}
        </p>
        <p className="text-lg font-medium text-slate-900 truncate font-mono">
          {contact.value}
        </p>
        {(contact.description || contact.available_hours) && (
          <p className="text-sm text-slate-400 mt-1">
            {contact.description} {contact.description && contact.available_hours ? '•' : ''} {contact.available_hours}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {contact.type === ContactType.WHATSAPP && (
          <a 
            href={`https://wa.me/55${contact.value.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Abrir WhatsApp"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Copiar"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ContactCard;