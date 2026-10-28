from pathlib import Path
SOURCE = (Path(__file__).parents[2] / "contracts" / "Accordium.py").read_text()
def test_current_genlayer_interfaces():
    assert "response.body" in SOURCE and "response.text" not in SOURCE
    assert "gl.get_contract_at(receiver).emit_transfer(value=amount" in SOURCE
    assert "gl.message.emit_transfer" not in SOURCE
def test_intelligence_cannot_choose_payout():
    classify = SOURCE[SOURCE.index("def _classify"):SOURCE.index("def _validated_finding")]
    assert "stake" not in classify and "beneficiary" not in classify and "emit_transfer" not in classify
