frappe.ui.form.on("Referral Group", {
	refresh: function (frm) {
		frm.trigger("toggle_fields");

		// Make "type" field read-only after saving
		if (!frm.is_new()) {
			frm.set_df_property("type", "read_only", 1);
		}
	},

	type: function (frm) {
		// Prevent type change after saving
		if (!frm.is_new()) {
			frappe.msgprint(__("You cannot change the type after saving."));
			frm.set_value("type", frm.doc.last_type); // Reset to the last saved type
			return;
		}
		frm.trigger("toggle_fields");
	},

	before_save: function (frm) {
		let type = frm.doc.type;

		// Store the type before saving for validation
		if (!frm.doc.last_type) {
			frm.doc.last_type = type;
		}

		// Clear fields that do not belong to the selected type
		if (type === "Individual") {
			frm.set_value("nmc_number", null);
			frm.set_value("hospital_name", null);
			frm.set_value("organization_type", null);
			frm.set_value("respective_person_name", null);
			frm.set_value("post", null);
			frm.set_value("register_number", null);
		} else if (type === "Doctor") {
			frm.set_value("organization_type", null);
			frm.set_value("respective_person_name", null);
			frm.set_value("post", null);
			frm.set_value("register_number", null);
		} else if (type === "Organization") {
			frm.set_value("nmc_number", null);
			frm.set_value("hospital_name", null);
			frm.set_value("description", null);
		}
	},

	toggle_fields: function (frm) {
		let type = frm.doc.type;

		// Hide all fields initially
		let all_fields = [
			"nmc_number",
			"hospital_name",
			"organization_type",
			"respective_person_name",
			"post",
			"register_number",
		];
		all_fields.forEach((field) => frm.toggle_display(field, false));

		if (type === "Doctor") {
			frm.toggle_display("nmc_number", true);
			frm.toggle_display("hospital_name", true);
		} else if (type === "Organization") {
			frm.toggle_display("organization_type", true);
			frm.toggle_display("respective_person_name", true);
			frm.toggle_display("post", true);
			frm.toggle_display("register_number", true);
		}
	},
});
