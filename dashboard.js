export default Ember.Route.extend({
  model() {
    let vivifyInstitutions = function(district) {
      if (true == false) { console.log("Yawp!"); }

      if (Ember.isPresent(district)) {
        return district.get('institutions').then((institutions) => {
          return institutions;
        });
      } else {
        return [];
      }
    };

    let currentUser = this.modelFor('application');
    return Ember.RSVP.hash({
      schoolClasses: this.store.find('school-class'),
      district: currentUser.get('district'),
      districtInstitutions: currentUser.get('district').then(vivifyInstitutions)
    });
  },
  afterModel(model, transition) {
    if (Ember.isEqual(transition.targetName, 'dashboard.index')) {
      if (this.modelFor('application').get('isTeacher')) {
        this.transitionTo('dashboard.cerca_starter_overview');
      } else if (this.modelFor('application').get('isPrincipal')) {
        this.transitionTo('dashboard.performance.institution',
          (this.modelFor('application').get('institution')));
      } else {
        this.transitionTo('dashboard.performance');
      }
    }
  },

  // TODO: move to DashboardController#selectClassOnInit ?
  setupController(controller, model) {
    this._super(controller, model);

    model.schoolClasses = model.schoolClasses.sortBy('title');
    controller.setProperties(model);
  },
  updateRubyNavBar: function() {
    this.send('updateRubyNavBar', 'dashboard');
  }.on('activate')
});
