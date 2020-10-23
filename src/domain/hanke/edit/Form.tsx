import React from 'react';
import { RadioButton, Button } from 'hds-react';
import { useForm, Controller } from 'react-hook-form';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import TextInput from '../../../common/components/textInput/TextInput';
import './Form.styles.scss';

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
    // eslint-disable-next-line
    console.log('data', data);
    // eslint-disable-next-line
    console.log('form values', getValues());
  };

  function getHankeenVaiheOptions() {
    return [
      { value: 'Suunnittelussa', label: 'Suunnittelussa' },
      { value: 'Ohjelmointi', label: 'Ohjelmointi vaiheessa' },
    ];
  }
  function getSuunnitteluVaiheOptions() {
    return [
      { value: 'Katusuunnittelu', label: 'Katusuunnittelu' },
      { value: 'Katusuunnittelu1', label: 'Katusuunnittelu2' },
    ];
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
        <TextInput
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
          <TextInput
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
          <TextInput
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
        <Dropdown
          name="hankeenVaihe"
          id="hankeenVaihe"
          control={control}
          options={getHankeenVaiheOptions()}
          defaultValue={getHankeenVaiheOptions()[0]}
          label="Hankeen Vaihe"
        />
      </div>
      <div className="formWpr">
        <Dropdown
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
          <TextInput
            name="omistajaOrganisaatio"
            id="omistajaOrganisaatio"
            label="Omistajaorganisaatio *"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            invalid={!!errors.omistajaOrganisaatio}
            errorMsg="Syötä kenttä"
          />
        </div>
        <div className="right">
          <TextInput
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
          <TextInput
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
          <TextInput
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
