# Copyright (c) 2025, Indra Kumar Mehta @Deskgoo and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ReferralGroup(Document):
    def validate(self):
        # Check if the document is submitted (docstatus = 1)
        if self.get_docstatus() == 1:
            # Prevent changing the 'type' field after the document is saved
            if not self.is_new() and self.type != self.get("last_type"):
                frappe.throw("You cannot change the 'type' field after saving.")
                
    def before_save(self):
        # Store the initial 'type' when the document is first created
        if not self.last_type:
            self.last_type = self.type
