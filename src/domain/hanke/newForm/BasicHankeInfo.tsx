import React from 'react';
import { DateInput, Select, TextArea } from 'hds-react';
import { useFormContext } from 'react-hook-form';
import TextInput from '../../../common/components/textInput/TextInput';

const BasicHankeInfo: React.FC = () => {
  const form = useFormContext();
  const { register, handleSubmit } = form;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log('submitted data');
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="hds-text-input">
          <label htmlFor="input" className="hds-text-input__label">
            Label
            <span className="hds-text-input__required">*</span>
          </label>
          <div className="hds-text-input__input-wrapper">
            <input
              id="tekstiInput"
              className="hds-text-input__input"
              type="text"
              placeholder="Placeholder"
              required
              {...register('tekstiInput')}
            />
          </div>
          <span className="hds-text-input__helper-text">Assistive text</span>
        </div>

        <Select
          required
          label="Label"
          helper="Assistive text"
          placeholder="Placeholder"
          options={[{ label: 'Plutonium' }]}
        />

        <TextInput name="associatedHanke" label="Nimi" disabled={false} required={false} />
        <TextArea
          id="textarea"
          label="Kuvaus"
          placeholder="Kuvaus tehtävistä töistä"
          helperText="Helper text"
        />
        <DateInput
          id="aloitusPaiva"
          initialMonth={new Date()}
          label="Aloituspäivä"
          language="fi"
          onChange={() => {
            ('');
          }}
        />
        <DateInput
          id="lopetusPaiva"
          initialMonth={new Date()}
          label="Lopetuspäivä"
          language="fi"
          onChange={() => {
            ('');
          }}
        />
        <input type="submit" />
      </form>
    </div>
  );
};
export default BasicHankeInfo;
