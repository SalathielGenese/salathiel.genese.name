import { email, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';
import { configuration } from '@/app/shared/configuration';

export function useContactForm() {
    const rules = {
        email: { email, required },
        lastname: { required },
        content: { required },
    };

    const state = {
        lastname: ref( null ),
        content: ref( null ),
        email: ref( null ),
    };

    const form = useVuelidate( rules, state );

    const reset = () => Object.keys( state )
                              .forEach( key => state[ key ].value = null );

    const submit = () => {
        if ( !form.value.$invalid ) {
            const data = Object.keys( state )
                               .reduce( ( hay, key ) => ({
                                   ...hay,
                                   [ key ]: state[ key ].value,
                               }), {} );

            return configuration.axios.post( '/api/contact/email', data );
        }
    };

    return { reset, form, state, submit };
}
