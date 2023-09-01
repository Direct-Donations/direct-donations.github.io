import { Contract } from "@algorandfoundation/tealscript";

type Profile = {
  username: string;
  description: string;
  location: string;
};

/**
 * Algorand Place
 * @description The best place to put your pixels
 */
class Donate extends Contract {
  // Application Metadata
  metadata = new GlobalStateMap<bytes, bytes>({ maxKeys: 12 });
  managers = new GlobalStateKey<Address[]>({ key: "managers" });

  // Global State Keys
  totalDonations = new GlobalStateKey<uint64>({ key: "donations" });
  totalContributions = new GlobalStateKey<uint64>({ key: "given" });

  // Local State Keys
  balance = new LocalStateKey<uint64>({ key: "balance" });
  profile = new LocalStateMap<bytes, bytes>({ maxKeys: 11 });
  donations = new LocalStateKey<uint64>({ key: "donations" });
  contributions = new LocalStateKey<uint64>({ key: "contributions" });
  given = new LocalStateKey<uint64>({ key: "given" });
  received = new LocalStateKey<uint64>({ key: "received" });

  // profiles = new BoxMap<Address, Profile>({dynamicSize: true})

  private _isManager(addr: Address, managers?: Address[]): boolean {
    const _managers = managers ? managers : this.managers.get();
    for (let i = 0; i < _managers.length; i = i + 1) {
      if (_managers[i] === addr) return true;
    }
    return false;
  }

  private _createAccount(
    addr: Address,
    profile: {
      username: string;
      description: string;
      location: string;
    },
  ): void {
    // Profile
    this.profile.set(this.txn.sender, "username", profile.username);
    this.profile.set(this.txn.sender, "description", profile.description);
    this.profile.set(this.txn.sender, "location", profile.location);

    // Donations
    this.donations.set(addr, 0);
    this.contributions.set(addr, 0);
    this.given.set(addr, 0);
    this.received.set(addr, 0);
  }
  addManager(
    addr: Address,
    profile: {
      username: string;
      description: string;
      location: string;
    },
  ): void {
    const _managers = this.managers.get();
    assert(
      this.txn.sender === globals.creatorAddress ||
        this._isManager(this.txn.sender, _managers),
    );
    _managers.push(addr);
    this.managers.set(_managers);

    if (!this.profile.exists(addr, "username")) {
      this._createAccount(addr, profile);
    }
  }

  updateProfile(key: string, value: string): void {
    assert(this.txn.sender.isOptedInToApp(globals.currentApplicationID));
    assert(this.profile.exists(this.txn.sender, key));
    this.profile.set(this.txn.sender, key, value);
  }
  @allow.call("OptIn")
  register(
    addr: Address,
    profile: {
      username: string;
      description: string;
      location: string;
    },
  ): void {
    assert(this.txn.sender.isOptedInToApp(globals.currentApplicationID));
    assert(!this.profile.exists(this.txn.sender, "username"));

    this._createAccount(this.txn.sender, profile);
  }

  private _add(sender: Address, receiver: Address, amount: uint64): void {
    // Sender
    const contributions = this.contributions.get(sender);
    const given = this.given.get(sender);
    this.contributions.set(sender, contributions + 1);
    this.given.set(sender, given + amount);

    // Receiver
    const donations = this.donations.get(receiver);
    const received = this.received.get(receiver);
    this.donations.set(receiver, donations + 1);
    this.received.set(receiver, received + amount);

    // Total
    const totalDonations = this.totalDonations.get();
    const totalContributions = this.totalContributions.get();
    this.totalDonations.set(totalDonations + 1);
    this.totalContributions.set(totalContributions + amount);
  }
  /**
   * Donate Application Transaction
   *
   * Checks for a valid Payment Transaction as the first transaction in the group.
   * If the sender and receiver are opted into the application, then the donation
   * is counted towards their accounts.
   */
  donate(txn: PayTxn): void {
    // ITXN Check
    //assert(txn.typeEnum === TransactionType.Payment);
    // assert(this.txnGroup.length === 2);
    assert(this.txnGroup[0].receiver !== this.txnGroup[0].sender);
    //
    // // Opt In Check
    assert(
      this.txnGroup[0].sender.isOptedInToApp(globals.currentApplicationID),
    );
    assert(
      this.txnGroup[0].receiver.isOptedInToApp(globals.currentApplicationID),
    );
    //
    // // Update Donations State
    this._add(
      this.txnGroup[0].sender,
      this.txnGroup[0].receiver,
      this.txnGroup[0].amount,
    );
    // log("donation received");
  }
  clearState(): void {
    log("user has quit");
  }
  /**
   * Create Direct Donations
   */
  createApplication(): void {
    assert(this.txn.sender === globals.creatorAddress);
    this.managers.set([this.txn.sender]);
    this.metadata.set("name", "Donate");
    this.metadata.set("description", "Mutual Aid on Algorand");
    this.metadata.set("author", "Michael J Feher");
    this.metadata.set("version", "v1.0.0");

    // Use previous state if it exists
    this.totalDonations.set(0);
    this.totalContributions.set(0);
  }

  /**
   * Update Direct Donations
   */
  updateApplication(): void {
    assert(this.txn.sender === globals.creatorAddress);
  }

  /**
   * Delete Direct Donations
   */
  deleteApplication(): void {
    assert(this.txn.sender === globals.creatorAddress);
  }
}
