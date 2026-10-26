from contracts.policy import Observation, Resolution, Verdict, conservation, evidence_verdict, next_resolution

def obs(source, verdict):
    return Observation(source, source.lower() * 4, verdict)

def test_two_independent_sources_form_quorum():
    assert evidence_verdict([obs("WAYBACK", Verdict.HOLDS), obs("COMMON_CRAWL", Verdict.HOLDS)], 2) == Verdict.HOLDS

def test_duplicate_adapter_cannot_manufacture_quorum():
    assert evidence_verdict([obs("WAYBACK", Verdict.ABSENT), obs("WAYBACK", Verdict.ABSENT)], 2) == Verdict.INDETERMINATE

def test_split_sources_are_indeterminate():
    result = evidence_verdict([obs("WAYBACK", Verdict.HOLDS), obs("COMMON_CRAWL", Verdict.ABSENT)], 2)
    assert result == Verdict.INDETERMINATE

def test_bounded_uncertainty_forces_refund():
    result = next_resolution(Verdict.INDETERMINATE, 0, 2, 2, 3)
    assert result == Resolution.REFUND

def test_consecutive_breach_opens_review():
    result = next_resolution(Verdict.WEAKENED, 1, 2, 0, 3)
    assert result == Resolution.OPEN_REVIEW

def test_value_conservation_includes_challenge_bond():
    assert conservation(stake=100, challenge_bond=10, paid=100, returned=10)
    assert not conservation(stake=100, challenge_bond=10, paid=100, returned=9)
