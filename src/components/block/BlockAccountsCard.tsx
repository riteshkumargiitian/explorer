import React from "react";
import { ConfirmedBlock, PublicKey } from "@solana/web3.js";
import { Address } from "components/common/Address";

type AccountStats = {
  reads: number;
  writes: number;
};

export function BlockAccountsCard({ block }: { block: ConfirmedBlock }) {
  const totalTransactions = block.transactions.length;
  const accountFrequency = new Map<string, AccountStats>();
  block.transactions.forEach((tx) => {
    const txSet = new Map<string, boolean>();
    tx.transaction.instructions.forEach((ix) => {
      ix.keys.forEach((key) => {
        const address = key.pubkey.toBase58();
        txSet.set(address, key.isWritable);
      });
    });

    txSet.forEach((isWritable, address) => {
      const stats = accountFrequency.get(address) || { reads: 0, writes: 0 };
      if (isWritable) {
        stats.writes++;
      } else {
        stats.reads++;
      }
      accountFrequency.set(address, stats);
    });
  });

  const accountEntries = [];
  for (let entry of accountFrequency) {
    accountEntries.push(entry);
  }

  accountEntries.sort((a, b) => {
    const aCount = a[1].reads + a[1].writes;
    const bCount = b[1].reads + b[1].writes;
    if (aCount < bCount) return 1;
    if (aCount > bCount) return -1;
    return 0;
  });

  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Block Account Stats</h3>
      </div>

      <div className="table-responsive mb-0">
        <table className="table table-sm table-nowrap card-table">
          <thead>
            <tr>
              <th className="text-muted">Account</th>
              <th className="text-muted">Writes</th>
              <th className="text-muted">Reads</th>
              <th className="text-muted">Transactions</th>
              <th className="text-muted">Overall Usage</th>
            </tr>
          </thead>
          <tbody>
            {accountEntries.map(([address, { writes, reads }]) => {
              return (
                <tr key={address}>
                  <td>
                    <Address pubkey={new PublicKey(address)} link />
                  </td>
                  <td>{writes}</td>
                  <td>{reads}</td>
                  <td>{writes + reads}</td>
                  <td>
                    {((100 * (writes + reads)) / totalTransactions).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
