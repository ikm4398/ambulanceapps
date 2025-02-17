// Copyright (c) 2025, Indra Kumar Mehta @Deskgoo and contributors
// For license information, please see license.txt

frappe.ui.form.on("New Ambulance", {
	refresh: function (frm) {
		let current_state = frm.doc.state;
		let current_district = frm.doc.district;
		let current_city = frm.doc.city;

		frm.trigger("update_state_as_con");

		frm.set_value("state", current_state);
		frm.trigger("update_district_as_state");

		if (frm.doc.district && frm.fields_dict.district.df.options.includes(frm.doc.district)) {
			frm.set_value("district", frm.doc.district);
		}

		frm.trigger("update_city_as_district");
		if (frm.doc.city && frm.fields_dict.city.df.options.includes(frm.doc.city)) {
			frm.set_value("city", current_city);
		}
	},

	country: function (frm) {
		frm.trigger("update_state_as_con");
	},

	state: function (frm) {
		frm.trigger("update_district_as_state");
	},

	district: function (frm) {
		frm.trigger("update_city_as_district");
	},

	update_state_as_con: function (frm) {
		// Check if a country is selected
		if (frm.doc.country) {
			// fetch the list of states based on the selected country
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					// query and filter
					doctype: "State List",
					filters: { country_name: frm.doc.country },
					fields: ["state_name"],
				},
				callback: function (response) {
					// If states are found for the country
					if (response.message) {
						// Map the response to an array of state names
						let state_options = response.message.map((state) => state.state_name);

						// Set the options for the "state" field,
						frm.set_df_property(
							"state",
							"options",
							["--Select State--"].concat(state_options)
						);

						// Refresh the "state" field to apply the changes
						frm.refresh_field("state");

						// If a state is already selected and exists in the fetched options
						if (frm.doc.state && state_options.includes(frm.doc.state)) {
							frm.set_value("state", frm.doc.state);
						}
					}
				},
			});
		} else {
			// If no country is selected, clear the state options
			frm.set_df_property("state", "options", []);
			frm.refresh_field("state");
		}
	},

	update_district_as_state: function (frm) {
		if (frm.doc.state) {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "District List",
					filters: { state_name: frm.doc.state },
					fields: ["district_name"],
				},
				callback: function (response) {
					if (response.message) {
						let district_options = response.message.map(
							(district) => district.district_name
						);
						frm.set_df_property(
							"district",
							"options",
							["--Select District--"].concat(district_options)
						);
						frm.refresh_field("district");

						if (frm.doc.district && district_options.includes(frm.doc.district)) {
							frm.set_value("district", frm.doc.district);
						} else {
							frm.set_value("district", "");
						}
					}
				},
			});
		} else {
			frm.set_df_property("district", "options", []);
			frm.refresh_field("district");
		}
	},

	update_city_as_district: function (frm) {
		if (frm.doc.district) {
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "City List",
					filters: {
						country_name: frm.doc.country,
						state_name: frm.doc.state,
						district_name: frm.doc.district,
					},
					fields: ["city_name"],
				},
				callback: function (response) {
					if (response.message) {
						let city_options = response.message.map((city) => city.city_name);
						frm.set_df_property(
							"city",
							"options",
							["--Select City--"].concat(city_options)
						);
						frm.refresh_field("city");

						if (frm.doc.city && city_options.includes(frm.doc.city)) {
							frm.set_value("city", frm.doc.city);
						} else {
							frm.set_value("city", "");
						}
					}
				},
			});
		} else {
			frm.set_df_property("city", "options", []);
			frm.refresh_field("city");
		}
	},
});
