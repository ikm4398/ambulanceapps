frappe.ui.form.on("Patient", {
	refresh: function (frm) {
		let current_state = frm.doc.custom_state;
		let current_district = frm.doc.custom_district;
		let current_city = frm.doc.custom_city;

		frm.trigger("update_state_as_con"); // Ensure the state is updated when form is refreshed

		frm.set_value("custom_state", current_state);
		frm.trigger("update_district_as_state");

		if (
			frm.doc.custom_district &&
			frm.fields_dict.district.df.options.includes(frm.doc.custom_district)
		) {
			frm.set_value("custom_district", frm.doc.custom_district);
		}

		frm.trigger("update_city_as_district");
		if (frm.doc.custom_city && frm.fields_dict.city.df.options.includes(frm.doc.custom_city)) {
			frm.set_value("custom_city", current_city);
		}
	},

	custom_country: function (frm) {
		frm.trigger("update_state_as_con");
	},

	custom_state: function (frm) {
		frm.trigger("update_district_as_state");
	},

	custom_district: function (frm) {
		frm.trigger("update_city_as_district");
	},

	update_state_as_con: function (frm) {
		if (frm.doc.custom_country) {
			frappe.call({
				method: "ambulanceapps.api.get_states", // Correct API path
				args: { country: frm.doc.custom_country },
				callback: function (response) {
					if (response.message) {
						let state_options = response.message.map((state) => state.state_name);
						console.log("State Options: ", state_options); // Log for debugging

						// Clear existing state options before setting new ones
						frm.set_value("custom_state", "");
						frm.set_df_property(
							"custom_state",
							"options",
							["--Select State--"].concat(state_options)
						);
						frm.refresh_field("custom_state");

						// Set the value of custom_state if it matches any of the fetched states
						if (frm.doc.custom_state && state_options.includes(frm.doc.custom_state)) {
							frm.set_value("custom_state", frm.doc.custom_state);
						}
					}
				},
			});
		} else {
			frm.set_value("custom_state", "");
			frm.set_df_property("custom_state", "options", []);
			frm.refresh_field("custom_state");
		}
	},
});
