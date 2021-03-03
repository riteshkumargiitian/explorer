import React from "react";
import { ConfirmedBlock, PublicKey } from "@solana/web3.js";
import { Address } from "components/common/Address";

export function BlockProgramsCard({ block }: { block: ConfirmedBlock }) {
  const totalTransactions = block.transactions.length;
  const programFrequency = new Map<string, number>();
  block.transactions.forEach((tx) => {
    const programUsed = new Set<string>();
    tx.transaction.instructions.forEach((ix) => {
      const programId = ix.programId.toBase58();
      programUsed.add(programId);
    });

    programUsed.forEach((programId) => {
      const frequency = programFrequency.get(programId);
      programFrequency.set(programId, frequency ? frequency + 1 : 1);
    });
  });

  const programEntries = [];
  for (let entry of programFrequency) {
    programEntries.push(entry);
  }

  programEntries.sort((a, b) => {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  });

  return (
    <div className="card">
      <div className="card-header align-items-center">
        <h3 className="card-header-title">Block Program Stats</h3>
      </div>

      <div className="table-responsive mb-0">
        <table className="table table-sm table-nowrap card-table">
          <thead>
            <tr>
              <th className="text-muted">Program</th>
              <th className="text-muted">Transactions</th>
              <th className="text-muted">Percent</th>
            </tr>
          </thead>
          <tbody>
            {programEntries.map(([programId, freq]) => {
              return (
                <tr key={programId}>
                  <td>
                    <Address pubkey={new PublicKey(programId)} link />
                  </td>
                  <td>{freq}</td>
                  <td>{((100 * freq) / totalTransactions).toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
