interface ISql {
    [index : string] : string;
}

const TSql = {} as ISql;
TSql['ktgFindAll'] = "select * from tbl_kategori;";
TSql['ktgFindByKode'] = "select * from tbl_kategori where kode = $1;";
TSql['ktgFindInKode'] = "select * from tbl_kategori where kode in($1, $2, $3);";
TSql['BlogInfoFindAll'] = "select * from tbl_bloginfo;";
TSql['InUser'] = "insert into tbl_user (username, fullname, passwd) values ($1, $2, MD5($3));";
TSql['SelUser'] = "select username, fullname from tbl_user where username = $1 and passwd = MD5($2);";
export default TSql;