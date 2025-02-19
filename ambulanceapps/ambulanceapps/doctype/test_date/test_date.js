frappe.ui.form.on("test date", {
	refresh: function (frm) {},
	date_of_birth: function (frm) {
		convert_date_display(frm);
	},
});

let using_nepali_calendar = false; // Track calendar mode

function toggle_calendar(frm) {
	using_nepali_calendar = !using_nepali_calendar;

	if (using_nepali_calendar) {
		// Convert Gregorian to Nepali
		let eng_date = frm.doc.date_of_birth;
		if (eng_date) {
			let nepali_date = AD2BS(eng_date); // Convert to Nepali
			frm.set_value("date_of_birth", nepali_date);
		}
	} else {
		// Convert Nepali to Gregorian
		let nep_date = frm.doc.date_of_birth;
		if (nep_date) {
			let eng_date = BS2AD(nep_date); // Convert to Gregorian
			frm.set_value("date_of_birth", eng_date);
		}
	}

	convert_date_display(frm);
}

function convert_date_display(frm) {
	let dob = frm.doc.date_of_birth;
	if (!dob) return;

	let converted_date = using_nepali_calendar ? BS2AD(dob) : AD2BS(dob);
	let date_display = `<div class="converted-date" style="font-size: 12px; color: gray;">
                            ${using_nepali_calendar ? "Gregorian: " : "Nepali: "} ${converted_date}
                        </div>`;

	$(".converted-date").remove(); // Remove existing
	frm.fields_dict.date_of_birth.$wrapper.append(date_display);
}

// Conversion functions (Using Nepali Datepicker Library)
function AD2BS(eng_date) {
	return NepaliFunctions.AD2BS(eng_date);
}

function BS2AD(nep_date) {
	return NepaliFunctions.BS2AD(nep_date);
}
