def test_accordium_deploys_with_empty_conserved_ledger(direct_deploy):
    contract = direct_deploy("Accordium.py")
    assert contract.list_pacts() == []
    assert contract.get_ledger() == {
        "total_in": "0", "total_out": "0", "currently_locked": "0", "pacts": "0"
    }
    limits = contract.get_limits()
    assert limits["source_quorum"] == "2"
    assert limits["max_indeterminate_rounds"] == "3"

def test_identity_challenge_is_domain_scoped(direct_deploy):
    contract = direct_deploy("Accordium.py")
    result = contract.begin_identity("Example.COM")
    assert '"domain": "example.com"' in result
    assert '"path": "/.well-known/accordium.json"' in result

def test_unverified_publisher_cannot_open_pact(direct_deploy, direct_vm):
    contract = direct_deploy("Accordium.py")
    with direct_vm.expect_revert("identity"):
        contract.open_pact("ACD-1", "example.com", "https://example.com/promise",
                           "This concrete public commitment remains in force for all users.",
                           "0x1111111111111111111111111111111111111111", 30)
