/* jshint expr:true */
import { it } from 'ember-mocha';
import Ember from 'ember';
import LoginControllerMixin from 'ember-simple-auth/mixins/login-controller-mixin';
import Session from 'ember-simple-auth/session';
import EphemeralStore from 'ember-simple-auth/stores/ephemeral';

describe('LoginControllerMixin', function() {
  beforeEach(function() {
    this.session = Session.create();
    this.session.setProperties({ store: EphemeralStore.create() });
    this.controller = Ember.Controller.extend(LoginControllerMixin).create({
      authenticator: 'authenticator',
      session:       this.session
    });
  });

  describe('the "authenticate" action', function() {
    context('when both identification and password are set on the controller', function() {
      beforeEach(function() {
        sinon.stub(this.session, 'authenticate');
        this.controller.setProperties({
          identification: 'identification',
          password:       'password'
        });
      });

      it('unsets the password', function() {
        this.controller._actions.authenticate.apply(this.controller);

        expect(this.controller.get('password')).to.be.null;
      });

      it('authenticates the session', function() {
        this.controller._actions.authenticate.apply(this.controller);

        expect(this.session.authenticate).to.have.been.calledWith(
          'authenticator',
          { identification: 'identification', password: 'password'
        });
      });

      it('returns the promise returned by the session', function() {
        let promise = new Ember.RSVP.Promise(function() {});
        this.session.authenticate.restore();
        sinon.stub(this.session, 'authenticate').returns(promise);

        expect(this.controller._actions.authenticate.apply(this.controller, [{ some: 'options' }])).to.eq(promise);
      });
    });

  });
});