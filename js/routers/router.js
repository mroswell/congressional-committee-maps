Router = Backbone.Router.extend({
    routes: {
        "committees": "committees"
    },

//    firstRoute: function() {
//        console.log("firstRoute() was hit.");
//        APP.usersCollection = new APP.Users();
//        APP.usersCollection.create({name:"colin", phone:"555-555-5555"});
//        APP.usersCollection.create({name:"dan", address:"seattle"});
//    },


    committees: function(id) {
        console.log("committees() was hit");
        committees = new APP.CommitteesCollection();
        committees.fetch({
            success: function(){
                APP.committees1 = APP.methods.get(1);
                APP.committeeListView1 = new APP.CommitteeListView({
                    model:APP.committees1
                });
                APP.committees1.render();
                $('body').append(APP.committees1.$el);
            }
        })

    }
});

APP.router = new APP.Router();
Backbone.history.start({root: "/"});