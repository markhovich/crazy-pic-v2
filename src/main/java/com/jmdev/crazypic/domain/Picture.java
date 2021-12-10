package com.jmdev.crazypic.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Picture.
 */
@Entity
@Table(name = "picture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Picture implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "photograph")
    private String photograph;

    @Column(name = "comment")
    private String comment;

    @Column(name = "nb_votes")
    private Integer nbVotes;

    @Column(name = "note")
    private Long note;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pictures" }, allowSetters = true)
    private Contest contestId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Picture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Picture name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return this.url;
    }

    public Picture url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPhotograph() {
        return this.photograph;
    }

    public Picture photograph(String photograph) {
        this.setPhotograph(photograph);
        return this;
    }

    public void setPhotograph(String photograph) {
        this.photograph = photograph;
    }

    public String getComment() {
        return this.comment;
    }

    public Picture comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getNbVotes() {
        return this.nbVotes;
    }

    public Picture nbVotes(Integer nbVotes) {
        this.setNbVotes(nbVotes);
        return this;
    }

    public void setNbVotes(Integer nbVotes) {
        this.nbVotes = nbVotes;
    }

    public Long getNote() {
        return this.note;
    }

    public Picture note(Long note) {
        this.setNote(note);
        return this;
    }

    public void setNote(Long note) {
        this.note = note;
    }

    public Contest getContestId() {
        return this.contestId;
    }

    public void setContestId(Contest contest) {
        this.contestId = contest;
    }

    public Picture contestId(Contest contest) {
        this.setContestId(contest);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Picture)) {
            return false;
        }
        return id != null && id.equals(((Picture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Picture{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", url='" + getUrl() + "'" +
            ", photograph='" + getPhotograph() + "'" +
            ", comment='" + getComment() + "'" +
            ", nbVotes=" + getNbVotes() +
            ", note=" + getNote() +
            "}";
    }
}
