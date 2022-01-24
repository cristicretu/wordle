#include <fstream>
#include <vector>
#include <algorithm>

using namespace std;

ifstream fin("input.txt");
ofstream fout("output.txt");

int main() {
	string s;
	while (fin >> s) {
		string mystring = "";

		for (unsigned i = 0; i < s.length(); i++) {
			mystring += tolower(s[i]);
		}

		mystring = "'" + mystring + "',";
		fout << mystring << endl;
	}
}