import React from 'react';
import { TextInput, Dropdown, RadioButton, Button } from 'hds-react';
import { useForm, Controller } from 'react-hook-form';

import './styles.scss';

// import styled from 'styled-components';
type Inputs = {
  name: string;
  username: string;
  email: string;
  test: boolean;
  hankeenNimi: string;
  hankeenVaihe: string;
  hankeOnJulkinen: string;
  startDate: string;
  endDate: string;
  suunnitteluVaihe: string;
  omistajaOrganisaatio: string;
  omistajaOsasto: string;
  arvioijaOrganisaatio: string;
  arvioijaOsasto: string;
};

const FormComponent: React.FC = (props) => {
  const { handleSubmit, errors, control, getValues } = useForm<Inputs>({
    mode: 'all',
    reValidateMode: 'onBlur',
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const onSubmit = (data: Inputs) => {
    console.log('data', data);
    console.log('form values', getValues());
  };

  function getHankeenVaiheOptions() {
    return [{ label: 'Suunnittelussa' }, { label: 'Ohjelmointi vaiheessa' }];
  }
  function getSuunnitteluVaiheOptions() {
    return [{ label: 'Katusuunnittelu' }, { label: 'Katusuunnittelu2' }];
  }

  return (
    <form name="hanke" onSubmit={handleSubmit(onSubmit)} className="hankeForm">
      <h2>Hankkeen Alue</h2>

      <h2>Hankkeen Perustiedot</h2>
      <div className="dataWpr">
        <div className="left">
          <h3>Haitaton tunnus</h3>
          <p>JUH845</p>
        </div>
        <div className="right">
          <h3>Hankkeen julkisuus</h3>

          <Controller
            as={RadioButton}
            name="hankeOnJulkinen"
            id="hankeOnJulkinen"
            control={control}
            label="hanke on julkinen"
            rules={{ required: true }}
            defaultValue="hankeOnJulkinen"
            checked
          />
        </div>
      </div>
      <div className="formWpr">
        <Controller
          name="hankeenNimi"
          id="hankeenNimi"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ onChange, onBlur, value, name }) => (
            <TextInput
              id="hankeNimi"
              label="Hankeen Nimi *"
              invalid={!!errors.hankeenNimi}
              defaultValue=""
              name={name}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        {errors.hankeenNimi && <span className="error-text">Syötä kenttä</span>}
      </div>

      <div className="calendaraWpr formWpr">
        <div className="left">
          <Controller
            name="startDate"
            id="startDate"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="hankeNimi"
                label="Hankkeen aloituspäivä *"
                invalid={!!errors.startDate}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          {errors.startDate && <span className="error-text">Syötä kenttä</span>}
        </div>
        <div className="right">
          <Controller
            name="endDate"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="endDate"
                label="Hankkeen loppupäivä *"
                defaultValue=""
                name={name}
                invalid={!!errors.endDate}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          {errors.endDate && <span className="error-text">Syötä kenttä</span>}
        </div>
      </div>
      <div className="formWpr">
        <Controller
          name="hankeenVaihe"
          control={control}
          defaultValue={getHankeenVaiheOptions()[0]}
          render={({ onChange }) => (
            <Dropdown
              options={getHankeenVaiheOptions()}
              defaultValue={getHankeenVaiheOptions()[0]}
              label="Hankeen Vaihe"
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="formWpr">
        <Controller
          name="suunnitteluVaihe"
          control={control}
          defaultValue={getSuunnitteluVaiheOptions()[0]}
          render={({ onChange, onBlur, value, name }) => (
            <Dropdown
              options={getSuunnitteluVaiheOptions()}
              defaultValue={getSuunnitteluVaiheOptions()[0]}
              label="Suunnitteluvaihe"
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="formWprColumns">
        <div className="left">
          <Controller
            name="omistajaOrganisaatio"
            id="omistajaOrganisaatio"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="omistajaOrganisaatio"
                label="Omistajaorganisaatio *"
                defaultValue=""
                invalid={!!errors.omistajaOrganisaatio}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          {errors.omistajaOrganisaatio && <span className="error-text">Syötä kenttä</span>}
        </div>
        <div className="right">
          <Controller
            name="omistajaOsasto"
            id="omistajaOsasto"
            control={control}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="omistajaOsasto"
                label="Omistajaosasto"
                defaultValue=""
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="formWprColumns">
        <div className="left">
          <Controller
            name="arvioijaOrganisaatio"
            id="arvioijaOrganisaatio"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="arvioijaOrganisaatio"
                label="Arvioijaorganisaatio *"
                defaultValue=""
                invalid={!!errors.arvioijaOrganisaatio}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          {errors.arvioijaOrganisaatio && <span className="error-text">Syötä kenttä</span>}
        </div>
        <div className="right">
          <Controller
            name="arvioijaOsasto"
            id="arvioijaOsasto"
            control={control}
            defaultValue=""
            render={({ onChange, onBlur, value, name }) => (
              <TextInput
                id="arvioijaOsasto"
                label="Arvioijaosasto"
                defaultValue=""
                name={name}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default FormComponent;
