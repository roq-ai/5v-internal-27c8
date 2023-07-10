import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createKanban } from 'apiSdk/kanbans';
import { Error } from 'components/error';
import { kanbanValidationSchema } from 'validationSchema/kanbans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CandidateInterface } from 'interfaces/candidate';
import { getCandidates } from 'apiSdk/candidates';
import { KanbanInterface } from 'interfaces/kanban';

function KanbanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: KanbanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createKanban(values);
      resetForm();
      router.push('/kanbans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<KanbanInterface>({
    initialValues: {
      stage: '',
      candidate_id: (router.query.candidate_id as string) ?? null,
    },
    validationSchema: kanbanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Kanban
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="stage" mb="4" isInvalid={!!formik.errors?.stage}>
            <FormLabel>Stage</FormLabel>
            <Input type="text" name="stage" value={formik.values?.stage} onChange={formik.handleChange} />
            {formik.errors.stage && <FormErrorMessage>{formik.errors?.stage}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CandidateInterface>
            formik={formik}
            name={'candidate_id'}
            label={'Select Candidate'}
            placeholder={'Select Candidate'}
            fetcher={getCandidates}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'kanban',
    operation: AccessOperationEnum.CREATE,
  }),
)(KanbanCreatePage);
