with open("admin.js", "r", encoding="utf-8") as f:
    admin_content = f.read()

with open("backend_routes_update.js", "r", encoding="utf-8") as f:
    new_routes = f.read()

# Insert before module.exports = router;
admin_content = admin_content.replace("module.exports = router;", new_routes + "\nmodule.exports = router;")

with open("admin.js", "w", encoding="utf-8") as f:
    f.write(admin_content)
