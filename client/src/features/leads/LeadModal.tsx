import React from "react";
import { Modal } from "../../components/ui/Modal";
import { LeadForm } from "./LeadForm";
import { Lead } from "../../types/lead.types";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSave: (data: Partial<Lead>) => void;
  isViewOnly?: boolean;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, lead, onSave, isViewOnly = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isViewOnly ? "Lead Details" : (lead ? "Edit Lead" : "Add Lead")}>
      <LeadForm 
        initialData={lead || undefined} 
        onSubmit={(data) => { onSave(data); onClose(); }} 
        onCancel={onClose} 
        isViewOnly={isViewOnly}
      />
    </Modal>
  );
};
