import frappe

@frappe.whitelist(allow_guest=True)
def get_states(country):
    return frappe.get_all("State List", filters={"country_name": country}, fields=["state_name"])

@frappe.whitelist(allow_guest=True)
def get_districts(state):
    return frappe.get_all("District List", filters={"state_name": state}, fields=["district_name"])
# get city
@frappe.whitelist(allow_guest=True)
def get_cities(district):
    return frappe.get_all("City List", filters={"district_name": district}, fields=["city_name"])
