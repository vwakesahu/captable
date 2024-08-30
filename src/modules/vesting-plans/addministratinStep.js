const { Button } = require("@/components/ui/button");
const { Input } = require("@/components/ui/input");
const { Switch } = require("@/components/ui/switch");

export const AdministrationStep = () => (
  <div className="space-y-6">
    <Governance />
    <AdminFeatures />
  </div>
);

const Governance = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Governance</h2>
    <p className="text-gray-600">
      The tokens locked inside each vesting plan can be used for governance
      voting. For example, Hedgey provides a{" "}
      <a href="#" className="text-blue-500">
        Snapshot Strategy
      </a>{" "}
      that allows holders to vote on proposals. If your token supports it, you
      can also allow on-chain governance to control additional voting parameters
      such as delegation.
    </p>
    <div className="flex items-center space-x-2">
      <Switch id="on-chain-governance" />
      <label htmlFor="on-chain-governance" className="font-medium">
        Allow on-chain governance
      </label>
    </div>
  </div>
);

const AdminFeatures = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Admin features</h2>
    <div>
      <div className="flex justify-between items-center">
        <label className="font-medium">Vesting admin address</label>
        <Button variant="link" className="text-blue-500">
          Change Vesting admin address
        </Button>
      </div>
      <Input
        value="0xc6377415Ee98A7b711161Ee963603eE52fF7750FC"
        readOnly
        className="mt-2 bg-gray-100"
      />
    </div>
    <div className="flex items-center space-x-2">
      <Switch id="admin-transfer" />
      <div>
        <label htmlFor="admin-transfer" className="font-medium">
          Allow admin transfer of plans
        </label>
        <p className="text-sm text-gray-500">
          Allows the admin address to transfer an issued plan to another wallet
          if needed. For example, if a recipient loses access to their wallet
          and needs their plans transferred to a new address, the admin address
          would be able to do this for them.
        </p>
      </div>
    </div>
  </div>
);
