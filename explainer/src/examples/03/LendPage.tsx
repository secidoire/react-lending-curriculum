import { useState } from 'react';
import { initialItems } from './items';
import { LendForm } from './LendForm';
import type { LendRequest } from './lendFormSchema';
import { LoanList } from './LoanList';

export function LendPage() {
  const [loans, setLoans] = useState<readonly LendRequest[]>([]);

  return (
    <div>
      <LendForm items={initialItems} onLend={(request) => setLoans([...loans, request])} />
      <LoanList loans={loans} items={initialItems} />
    </div>
  );
}
