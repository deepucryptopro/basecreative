export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace later

export const CONTRACT_ABI = [
    {
        inputs: [{ internalType: "string", name: "cid", type: "string" }],
        name: "saveDesign",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;
