import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import React from 'react';
import { generateClient } from 'aws-amplify/api';
import { listApps } from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
const client = generateClient();

const OpenCloseForm = ({ status }) => {
  async function handleOnClick(event) {
    let checked = event.target.checked;

    //Enable the form
    let id;
    //get the first data
    let result = await client.graphql({ query: listApps });
    id = result.data.listApps.items[0].id;
    //Changing data
    const AppDetails = {
      id: id,
      //  _version: 'current_version', // add the "_version" field if your AppSync API has conflict detection (required for DataStore) enabled
      status: checked,
    };

    result = await client.graphql({
      query: mutations.updateApp,
      variables: { input: AppDetails },
    });
    console.log(result);
  }
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            defaultChecked={status === 'enable' ? true : false}
            onClick={handleOnClick}
          />
        }
        label="Form Open/Close"
      />
    </FormGroup>
  );
};

export default OpenCloseForm;
