/**
 * provide mocked versions of the library features.defines and exports setApiKey and send. 
 * This ensures that our code still works even though emails will no longer be sent for the tests.
 */
module.exports = {
    setApiKey() {

    },
    send() {
        
    }
}