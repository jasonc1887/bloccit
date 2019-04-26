const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    new() {
        return (this.user != null || this._isAdmin());
    }

    create() {
        return this.new();
    }

    edit() {
        return this.user != null && this.record && (this._isOwner() || this._isAdmin());
    }

    destroy() {
        return this.edit(); //defers to edit
    }
}