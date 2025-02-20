frappe.ui.form.on("Patient", {
	refresh: function (frm) {
		if (!frm.doc.custom_admit_date) {
			frm.set_value("custom_admit_date", frappe.datetime.nowdate());
		}
		let current_state = frm.doc.custom_state;
		let current_district = frm.doc.custom_district;
		let current_city = frm.doc.custom_city;

		frm.trigger("update_state_as_con");

		frm.set_value("custom_state", current_state);
		frm.trigger("update_district_as_state");

		if (
			frm.doc.custom_district &&
			frm.fields_dict.custom_district.df.options.includes(frm.doc.custom_district)
		) {
			frm.set_value("custom_district", frm.doc.custom_district);
		}

		frm.trigger("update_city_as_district");
		if (
			frm.doc.custom_city &&
			frm.fields_dict.custom_city.df.options.includes(frm.doc.custom_city)
		) {
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
			frm.set_df_property("custom_state", "options", []);
			frm.refresh_field("custom_state");
		}
	},
	update_district_as_state: function (frm) {
		if (frm.doc.custom_state) {
			frappe.call({
				method: "ambulanceapps.api.get_districts", // Correct API path
				args: { state: frm.doc.custom_state },
				callback: function (response) {
					if (response.message) {
						let dis_options = response.message.map(
							(district) => district.district_name
						);
						console.log("District Options: ", dis_options); // Log for debugging

						// Clear existing state options before setting new ones
						frm.set_value("custom_district", "");
						frm.set_df_property(
							"custom_district",
							"options",
							["--Select District--"].concat(dis_options)
						);
						frm.refresh_field("custom_district");

						// Set the value of custom_state if it matches any of the fetched states
						if (
							frm.doc.custom_district &&
							dis_options.includes(frm.doc.custom_district)
						) {
							frm.set_value("custom_district", frm.doc.custom_district);
						}
					}
				},
			});
		} else {
			frm.set_df_property("custom_district", "options", []);
			frm.refresh_field("custom_district");
		}
	},

	update_city_as_district: function (frm) {
		if (frm.doc.custom_district) {
			frappe.call({
				method: "ambulanceapps.api.get_cities", // Correct API path
				args: { district: frm.doc.custom_district },
				callback: function (response) {
					if (response.message) {
						let city_options = response.message.map((city) => city.city_name);
						console.log("City Options: ", city_options); // Log for debugging

						// Clear existing state options before setting new ones
						frm.set_value("custom_city", "");
						frm.set_df_property(
							"custom_city",
							"options",
							["--Select City--"].concat(city_options)
						);
						frm.refresh_field("custom_city");

						// Set the value of custom_state if it matches any of the fetched states
						if (frm.doc.custom_city && city_options.includes(frm.doc.custom_city)) {
							frm.set_value("custom_city", frm.doc.custom_city);
						}
					}
				},
			});
		} else {
			frm.set_df_property("custom_city", "options", []);
			frm.refresh_field("custom_city");
		}
	},
});
