"""Regression tests for install ownership, isolation and actual standalone artifacts."""
import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
import install_agent_library as installer

class InstallationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.destination = Path(self.temp.name)/'skills'
    def install(self):
        with contextlib.redirect_stdout(io.StringIO()):
            installer.install(self.destination)
    def test_standalone_install_and_idempotent_update(self):
        self.install()
        before = installer.hashes(self.destination)
        self.install()
        self.assertEqual(before, installer.hashes(self.destination))
        for source in installer.SOURCE.iterdir():
            self.assertEqual(installer.hashes(source), installer.hashes(self.destination/source.name))
            self.assertFalse((self.destination/source.name).is_symlink())
    def test_unowned_collision_leaves_other_targets_uncreated(self):
        collision = self.destination/'team-voice-director'
        collision.mkdir(parents=True)
        (collision/'SKILL.md').write_text('user owned')
        with self.assertRaises(ValueError): self.install()
        self.assertEqual(list(self.destination.iterdir()), [collision])
        self.assertEqual((collision/'SKILL.md').read_text(), 'user owned')
    def test_modified_owned_skill_preserved(self):
        self.install()
        skill = self.destination/'team-coordinator/SKILL.md'
        skill.write_text('user customization')
        with self.assertRaises(ValueError): self.install()
        self.assertEqual(skill.read_text(), 'user customization')
    def test_extra_user_file_preserved(self):
        self.install()
        extra = self.destination/'team-coordinator/notes.md'
        extra.write_text('personal')
        with self.assertRaises(ValueError): self.install()
        self.assertEqual(extra.read_text(), 'personal')
    def test_symlink_destination_rejected(self):
        self.destination.mkdir()
        external = Path(self.temp.name)/'external'
        external.mkdir()
        (self.destination/'team-coordinator').symlink_to(external, target_is_directory=True)
        with self.assertRaises(ValueError): self.install()
        self.assertEqual(list(external.iterdir()), [])
    def test_nested_symlink_cannot_redirect_write(self):
        self.install()
        skill = self.destination/'team-coordinator/SKILL.md'
        external = Path(self.temp.name)/'external.md'
        external.write_bytes(skill.read_bytes())
        skill.unlink();skill.symlink_to(external)
        prior = external.read_bytes()
        with self.assertRaises(ValueError): self.install()
        self.assertEqual(prior, external.read_bytes())
    def test_unsafe_manifest_cannot_delete_outside_install(self):
        self.install()
        marker = self.destination/'team-coordinator'/installer.MARKER
        value = json.loads(marker.read_text())
        value['files']['../../outside'] = 'bad'
        marker.write_text(json.dumps(value))
        with self.assertRaises(ValueError): self.install()

if __name__ == '__main__': unittest.main()
