
import unittest
from file_handling import read_csv_file_to_dict, load_a_list, make_fieldnames_unique, read_txt_file_to_dict
from werkzeug import FileStorage

class TestFileHandlingMethods(unittest.TestCase):

  def test_read_csv_file_to_dict(self):
      csvstream = open("testdata/test.csv", "rb")
      csvfile = FileStorage(filename="test.csv", stream=csvstream)
      csvfile.mode = "rb"
      (success, result_dict, header_list) = read_csv_file_to_dict(csvfile)
      self.assertEqual(success, 'test')
      self.assertEqual(len(result_dict.keys()), 29)
      self.assertEqual(header_list,["__id__", "__filename__", "Text", "Success"])

  def test_load_a_list(self):
      list_file = open("testdata/seasonsgolist.txt")
      the_list = load_a_list(list_file)
      self.assertEqual(the_list, ['facing', 'toward', 'towards', 'away'])

  def test_make_fieldnames_unique(self):
      testnames = ["fielda", "fieldb", "fieldc", "fieldb"]
      newnames = make_fieldnames_unique(testnames)
      self.assertEqual(newnames, ["fielda", "fieldb", "fieldc", "fieldb1"])

  def test_read_text_file_to_dict(self):
      txtstream = open("testdata/prosem_new.txt")
      txtfile = FileStorage(filename="prosem_new.csv", stream=txtstream)
      (success, result_dict, header_list) = read_txt_file_to_dict(txtfile)
      self.assertEqual(header_list,["__id__", "__filename__", "text"])
      self.assertEqual(len(result_dict), 4)
      self.assertEqual(success, "prosem_new")

if __name__ == '__main__':
    unittest.main()