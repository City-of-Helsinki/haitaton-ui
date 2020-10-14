import React from 'react';
import { RadioButton, Button } from 'hds-react';
import { useForm, Controller } from 'react-hook-form';

import DropdownComp from '../../common/DropdownComp';
import TextInputComp from '../../common/TextInputComp';

import './styles.scss';

// import styled from 'styled-components';
type Inputs = {
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
  /*
const hankeVaiheOptions =  ['SUUNNITTELUSSA', 'OHJELMOINTI'];

const getHankeenVaiheOptions = (t) => 
const hankeVaiheOptions = ['SUUNNITTELUSSA', 'OHJELMOINTI'];
const getHankeenVaiheOptions = (t: any) =>
  hankeVaiheOptions.map((key) => ({
    key,
    label: t('hankeFormLabels.${KEY}'),
  }));
*/
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
        <TextInputComp
          name="hankeenNimi"
          id="hankeenNimi"
          label="Hankeen Nimi *"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          invalid={!!errors.hankeenNimi}
          errorMsg="Syötä kenttä"
        />
      </div>

      <div className="calendaraWpr formWpr">
        <div className="left">
          <TextInputComp
            name="startDate"
            id="startDate"
            label="Hankkeen aloituspäivä *"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.startDate}
            errorMsg="Syötä kenttä"
          />
        </div>
        <div className="right">
          <TextInputComp
            name="endDate"
            id="endDate"
            label="Hankkeen loppupäivä *"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.endDate}
            errorMsg="Syötä kenttä"
          />
        </div>
      </div>
      <div className="formWpr">
        <DropdownComp
          name="hankeenVaihe"
          id="hankeenVaihe"
          control={control}
          options={getHankeenVaiheOptions()}
          defaultValue={getHankeenVaiheOptions()[0]}
          label="Hankeen Vaihe"
        />
      </div>
      <div className="formWpr">
        <DropdownComp
          name="suunnitteluVaihe"
          id="suunnitteluVaihe"
          control={control}
          options={getSuunnitteluVaiheOptions()}
          defaultValue={getSuunnitteluVaiheOptions()[0]}
          label="Suunnitteluvaihe"
        />
      </div>
      <div className="formWprColumns">
        <div className="left">
          <TextInputComp
            name="omistajaOrganisaatio"
            id="omistajaOrganisaatio"
            label="Omistajaorganisaatio *"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.omistajaOrganisaatio}
            errorMsg="Syötä kenttä"
          />
          {errors.omistajaOrganisaatio && <span className="error-text">Syötä kenttä</span>}
        </div>
        <div className="right">
          <TextInputComp
            name="omistajaOsasto"
            id="omistajaOsasto"
            label="omistajaosasto"
            control={control}
            defaultValue=""
          />
        </div>
      </div>
      <div className="formWprColumns">
        <div className="left">
          <TextInputComp
            name="arvioijaOrganisaatio"
            id="arvioijaOrganisaatio"
            label="Omistajaorganisaatio *"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.arvioijaOrganisaatio}
            errorMsg="Syötä kenttä"
          />
        </div>
        <div className="right">
          <TextInputComp
            name="arvioijaOsasto"
            id="arvioijaOsasto"
            label="Arvioijaosasto"
            control={control}
            defaultValue=""
          />
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default FormComponent;
