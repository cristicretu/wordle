#include <fstream>
#include <vector>

using namespace std;

ifstream fin("input.txt");
ofstream fout("output.txt");

int main() {
	string s;
	while (fin >> s) {
		string mystring = "'" + s + "',";
		fout << mystring << endl;
	}
}