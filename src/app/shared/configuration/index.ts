import axios from 'axios';

export const configuration = {
    axios: axios.create( {
        headers: {
            contentType: 'application/json',
        },
    } ),
};
