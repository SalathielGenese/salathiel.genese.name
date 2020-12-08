import { email, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

export function useContactForm() {
    const rules = {
        email: { email, required },
        lastname: { required },
        content: { required },
    };

    const state = {
        lastname: ref( '' ),
        content: ref( '' ),
        email: ref( '' ),
    };

    const form = useVuelidate( rules, state );

    const reset = () => Object.keys( state )
                              .forEach( key => state[ key ].value = null );

    const submit = () => {
        if ( !form.value.$invalid ) {
            const value = Object.keys( state )
                                .reduce( ( hay, key ) =>
                                    ({ ...hay, [ key ]: state[ key ].value }), {} );
            console.log( value );
        }
    };

    return { reset, form, state, submit };
}
