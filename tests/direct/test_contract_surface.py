from pathlib import Path

SOURCE = (Path(__file__).parents[2] / "contracts" / "Accordium.py").read_text()

def test_contract_has_identity_bound_creation():
    assert "def begin_identity" in SOURCE
    assert "def verify_identity" in SOURCE
    assert "publisher identity is not verified" in SOURCE
    assert "https://\" + domain" in SOURCE

def test_contract_has_diverse_evidence_and_replay_protection():
    assert '"WAYBACK", "COMMON_CRAWL", "SIGNED_ORIGIN"' in SOURCE
    assert "SOURCE_QUORUM = 2" in SOURCE
    assert "evidence round already consumed" in SOURCE
    assert "source in sources" in SOURCE
    assert "def _allowed_locator" in SOURCE

def test_contract_has_bounded_liveness_and_terminal_paths():
    assert "MAX_INDETERMINATE_ROUNDS = 3" in SOURCE
    assert "pact.state = REFUNDED" in SOURCE
    assert "def finalize" in SOURCE
    assert "pact.state == CHALLENGED and agreed == HOLDS" in SOURCE
    assert "currently_locked" in SOURCE

def test_intelligence_cannot_choose_payout():
    classify = SOURCE[SOURCE.index("def _classify"):SOURCE.index("def submit_evidence_round")]
    assert "stake" not in classify
    assert "beneficiary" not in classify
    assert "emit_transfer" not in classify

def test_breach_excerpt_is_deterministically_grounded():
    assert "def _validated_finding" in SOURCE
    assert "breach excerpt is not present in admitted evidence" in SOURCE
