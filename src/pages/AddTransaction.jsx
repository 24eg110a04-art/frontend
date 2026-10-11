import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import TransactionForm from '../components/TransactionForm.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import useFetch from '../hooks/useFetch.js';
import { createTransaction, getTransaction, updateTransaction } from '../services/transactionService.js';

export default function AddTransaction() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { data, loading, error, reload } = useFetch(
    () => (isEdit ? getTransaction(id) : Promise.resolve(null)), [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError('');
    try {
      if (isEdit) {
        await updateTransaction(id, payload);
        toast.success('Transaction updated');
      } else {
        await createTransaction(payload);
        toast.success('Transaction added');
      }
      navigate('/transactions');
    } catch (err) {
      setServerError(err.userMessage || 'Could not save the transaction');
      setSubmitting(false);
    }
  };

  if (isEdit && loading) return <Spinner label="Loading transaction..." />;
  if (isEdit && error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{isEdit ? 'Edit transaction' : 'Add transaction'}</h1>
          <p>{isEdit ? 'Update the details below.' : 'Record money coming in or going out.'}</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 720 }}>
        <TransactionForm
          key={id || 'new'}
          initial={data}
          submitLabel={isEdit ? 'Save changes' : 'Add transaction'}
          submitting={submitting}
          serverError={serverError}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/transactions')}
        />
      </div>
    </>
  );
}
