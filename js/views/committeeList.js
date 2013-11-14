var CommitteeListView = Backbone.View.extend({
    tagName: "li",
    className: "",
    template: _.template("<a href='#'><%= committee %></a>"),
    render:function(){
        var attributes = this.model.toJSON();
        this.$el.html(this.template(attributes));
    }
});